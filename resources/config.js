export default {

    wallets: {

        rpcUrls: {
            development: {
                31: "https://public-node.testnet.rsk.co"
            },
            test: {
                31: "https://public-node.testnet.rsk.co"
            },
            production: {
                30: "https://public-node.rsk.co"
            }
        },
    
        portisOptions: {
            development: {
                id: "a1c8672b-7b1c-476b-b3d0-41c27d575920",
                network: {
                    nodeUrl: "https://public-node.testnet.rsk.co",
                    chainId: 31
                }
            },
            test: {
                id: "a1c8672b-7b1c-476b-b3d0-41c27d575920",
                network: {
                    nodeUrl: "https://public-node.testnet.rsk.co",
                    chainId: 31
                }
            },
            production: {
                id: "a1c8672b-7b1c-476b-b3d0-41c27d575920",
                network: {
                    nodeUrl: "https://public-node.rsk.co",
                    chainId: 30
                }
            }
        }    
    },

    contractABI: require("./abis/CryptoTestamentService.json"),

    contractAddresses: {
        development: "0xeCa6070e1A9CB0D3FABC2Ca17B37396aE0ED94Df",
        test: "0xeCa6070e1A9CB0D3FABC2Ca17B37396aE0ED94Df",
        production: "0x6F5E511515e53dF613F5b372391242dFA71784f1"
    },

    notifyTheshold: 7 * 24 * 3600,

    servicePublickKey:  "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB+b7qrWcuBkpmiCcUBO0RQ\n" +
    "ZjAi6kAivuXUZB5dcJ/HO8zbf9XkseRn3fJEmxXJz/G8qVis14VqPQkv07mEHisr\n" +
    "pweKHRl+YwIsKfOw7kQwzMfiF5X9hNZt9bHaszOPsOxBgKK3bE1W2K04V3MYmFxk\n" +
    "ft4wG2KgVL8czFlfk8COOwnl6tLg/0GqVBy4KWZCz6ZkJbONalAH2zZ6gkCIySio\n" +
    "xS7mZJMdHOZoZkSBEBOZXHY7SCfGze/+0ggzD9BgBHssivx9lET94XLfT7F0hvJQ\n" +
    "hj/GVuIojQ9oVW36c5JdJ5aoRdvkhiRVPf0LUh0SAMQapUdgGZ26MBxoBWR0x831\n" +
    "AgMBAAE=\n" +
    "-----END PUBLIC KEY-----",

}

