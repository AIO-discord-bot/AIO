const mongoose = require("mongoose");
const { getSettings } = require("@schemas/Guild");


const reqString = {
    type: String,
    required: true,
};
const reqBoolean = {
    type: Boolean,
    required: true,
};
const reqArray = {
    type: Array,
    required: true,
};

const Schema = mongoose.Schema({
    key: reqString,
    genTimestamp: reqString,
    genBy: reqString,
    expireAfter: reqString,

    used: reqBoolean,
    redeemedBy: String,
    redeemedAt: String,
    premiumExpiresAt: String,

    multipleUseTried: reqArray
});

const Model = mongoose.model("premium-keys", Schema);

module.exports = {
    logKey: async (userID, key, keyTime, premiumTime) =>
        new Model({
            key: key,
            genTimestamp: new Date().getTime(),
            genBy: userID,
            expireAfter: keyTime,

            used: false,
            redeemedBy: null,
            redeemedAt: null,
            premiumExpiresAt: premiumTime,
            multipleUseTried: {
                type: Array()
            }
        }).save(),
    redeemKey: async (userID, key) => {
        try {
            // Get key
            const nowTimestamp = new Date().getTime();
            //let keyData = await collection.find({ key: key }).limit(1);
            let keyData = null;
            await Model.findOne({ key: key }, function (err, data) { keyData = data });
            if (!keyData) return [keyData, "NO_KEY"];

            multiUseUpdate = async () => {
                if (!keyData.multipleUseTried[userID]) keyData.multipleUseTried[userID] = 0;
                keyData.multipleUseTried[userID] = parseInt(keyData.multipleUseTried[userID] + 1);
                await Model.updateOne({ key: key }, { $set: { multipleUseTried: keyData.multipleUseTried } });
            };

            givePremium = async () => {
                // Log key
                await Model.updateOne({ key: key }, { $set: { used: true, redeemedBy: userID, redeemedAt: nowTimestamp } });
            
                const settings = await getSettings(guild);
                if (!settings.premium.enabled) settings.premium.enabled = true;
                settings.premium.details.userpaid = userID;
                settings.premium.details.transactionAmount = keyData.purchaseAmount;

                if (!settings.premium.details.premiumExpiresAt || (settings.premium.details.premiumExpiresAt && (nowTimestamp > settings.premium.details.premiumExpiresAt)))
                    settings.premium.details.premiumExpiresAt = nowTimestamp;
                premium.details.premiumExpiresAt += keyData.premiumExpiresAt;

                // Save settings
                settings.save();            
            }


            // Check if expired
            if (nowTimestamp > (nowTimestamp + keyData.expireAfter)) {
                await multiUseUpdate();
                return [keyData, "EXPIRED_KEY"];
            };

            // Check if redeemed
            if (keyData.used) {
                await multiUseUpdate();
                return [keyData, "ALREADY_REDEEMED"];
            };

            // Update guild
            await givePremium();
            return [keyData, "KEY OK"];
        } catch (ex) {
            console.log(ex); // probably might want to log that.
            return [null, "ERROR-"+ex.message]
        }
    }
};
