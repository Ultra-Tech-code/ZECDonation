const { v4: uuidv4 } = require('uuid');
const { db } = require('./database');
const lightwalletd = require('./lightwalletd-client').sharedClient;

function generateSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}

class CampaignService {
  static createCampaign(title, description, targetAmount, deadline, donationAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4();
        const slug = generateSlug(title);

        const address = typeof donationAddress === 'string' ? donationAddress.trim() : '';
        if (!address) {
          return reject(new Error('donationAddress is required for campaign creation'));
        }

        const sql = `
          INSERT INTO campaigns (id, title, description, target_amount, donation_address, deadline, slug)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(sql, [id, title, description, targetAmount, address, deadline, slug], function (err) {
          if (err) return reject(err);
          resolve({
            id,
            title,
            description,
            target_amount: targetAmount,
            donation_address: address,
            deadline,
            slug,
            status: 'active',
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static getCampaign(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM campaigns WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static getCampaignBySlug(slug) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM campaigns WHERE slug = ?', [slug], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static getAllCampaigns() {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM campaigns ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static getCampaignsByStatus(status) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC',
        [status],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static updateCampaignStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        function (err) {
          if (err) return reject(err);
          resolve({ id, status });
        }
      );
    });
  }

  static async getCampaignBlockchainData(address) {
    try {
      const [received, txList] = await Promise.all([
        zcash.listReceivedByAddress(1, false).catch(() => []),
        zcash.listTransactions('*', 100).catch(() => []),
      ]);

      const addressEntry = Array.isArray(received)
        ? received.find((r) => r.address === address)
        : null;

      const txHashes = [];
      if (Array.isArray(txList)) {
        for (const tx of txList) {
          if (tx.address === address && !txHashes.includes(tx.txid)) {
            txHashes.push({
              txid: tx.txid,
              amount: tx.amount,
              confirmations: tx.confirmations,
              time: tx.time,
              address: tx.address,
              category: tx.category,
            });
          }
        }
      }

      return {
        total_received: addressEntry ? addressEntry.amount : null,
        txs: txHashes,
      };
    } catch {
      return { total_received: null, txs: [] };
    }
  }

  static getCampaignDonations(campaignId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM donations WHERE campaign_id = ? ORDER BY created_at DESC',
        [campaignId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = CampaignService;
