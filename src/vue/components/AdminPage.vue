<template>
  <div class="container-dapp container-sm" v-if="loadingError !== null">
      <div class="alert alert-danger mb-1" role="alert" style="word-break: break-word;">
          Failure loading dApp: {{loadingError}}.
      </div>
  </div>
  <div class="container-dapp container-sm text-center" v-else-if="loading">
    <span>Loading...</span>
  </div>

  <div class="container-dapp container-sm text-muted" v-else>
    <!-- Service fees -->
    <div class="card shadow rounded mb-4" v-if="loadingError === null">
        <div class="card-body">
            <h5 class="card-title text-primary text-center mb-3">Services fees</h5>

            <div class="text-center mb-2">
                <strong>Available for withdraw: </strong><br />
                <em>{{formatBalance(serviceFeeBalance)}}</em>
            </div>

            <div class="text-center mb-2">
                <button type="button" class="btn btn-success mt-2" @click="withdrawServiceFees" :disabled="!serviceFeesAvailable || processing">{{processing ? "Please, wait..." : "Withdraw fees"}}</button>
            </div>
        </div>
    </div>

    <!-- Service private key -->
    <div class="card shadow rounded">
        <div class="card-body">
            <h5 class="card-title text-primary text-center mb-3">Service private key</h5>
            <div class="text-center mb-3">
                <textarea class="form-control" v-model="inputServiceKey" rows="5" :disabled="processing"></textarea>
            </div>
            <div class="text-center mt-2 mb-2">
                <button type="button" class="btn btn-success" @click="listTestaments" :disabled="!validServiceKey || processing">{{processing ? "Please, wait..." : "List testaments"}}</button>
            </div>
        </div>
    </div>     


    <!-- Testaments -->
    <div v-if="testamentList !== null">
        <!-- Notifiable testaments -->
        <h3 class="text-center text-danger mt-4">Testaments to be notified</h3>
        <div class="alert alert-info text-center" role="alert" style="word-break: break-word;" v-if="!notifiableTestaments">
            No testaments.
        </div>
        <div class="card shadow rounded" v-for="testament in testamentList.notifiable" :key="testament.id">
            <div class="card-body">
                <h5 class="card-title text-primary text-center mb-3">{{testament.testamentAddress}}</h5>
                <div class="mb-3">
                    <strong>Creation time:</strong> {{formatTimestamp(testament.creationTimestamp)}}<br/>
                    <strong>Testator name:</strong> {{testament.decryptedInfo.name}}<br/>
                    <strong>Testator email:</strong> {{testament.decryptedInfo.email}}<br/>
                    <strong>Testator address:</strong> {{testament.testatorAddress}}<br/>
                    <strong>Beneficiary name:</strong> {{testament.decryptedInfo.beneficiaryName}}<br/>
                    <strong>Beneficiary email:</strong> {{testament.decryptedInfo.beneficiaryEmail}}<br/>
                    <strong>Beneficiary address:</strong> {{testament.beneficiaryAddress}}<br/>
                    <strong>Available funds:</strong> {{formatBalance(testament.testamentBalance)}}<br/>
                    <strong>Unlock time:</strong> {{formatUnlockTimestamp(testament)}}<br/>
                </div>
            </div>
        </div>
        <!-- Executable testaments -->
        <h3 class="text-center mt-4 text-warning">Testaments to be executed</h3>
        <div class="alert alert-info text-center" role="alert" style="word-break: break-word;" v-if="!executableTestaments">
            No testaments.
        </div>
        <div class="card shadow rounded mt-3" v-for="testament in testamentList.executable" :key="testament.id">
            <div class="card-body">
                <h5 class="card-title text-primary text-center mb-3">{{testament.testamentAddress}}</h5>
                <div class="mb-3">
                    <strong>Creation time:</strong> {{formatTimestamp(testament.creationTimestamp)}}<br/>
                    <strong>Testator name:</strong> {{testament.decryptedInfo.name}}<br/>
                    <strong>Testator email:</strong> {{testament.decryptedInfo.email}}<br/>
                    <strong>Testator address:</strong> {{testament.testatorAddress}}<br/>
                    <strong>Beneficiary name:</strong> {{testament.decryptedInfo.beneficiaryName}}<br/>
                    <strong>Beneficiary email:</strong> {{testament.decryptedInfo.beneficiaryEmail}}<br/>
                    <strong>Beneficiary address:</strong> {{testament.beneficiaryAddress}}<br/>
                    <strong>Available funds:</strong> {{formatBalance(testament.testamentBalance)}}<br/>
                    <strong>Unlock time:</strong> {{formatUnlockTimestamp(testament)}}<br/>
                </div>
                <div class="text-center mt-2 mb-2">
                    <button type="button" class="btn btn-success" @click="executeTestament(testament.testatorAddress)" :disabled="processing">{{processing ? "Please, wait..." : "Execute"}}</button>
                </div>
            </div>
        </div>
        <!-- Executed testaments -->
        <h3 class="text-center mt-4 text-success">Testaments executed</h3>
        <div class="alert alert-info text-center" role="alert" style="word-break: break-word;" v-if="!executedTestaments">
            No testaments.
        </div>
        <div class="card shadow rounded mt-3"  v-for="testament in testamentList.executed" :key="testament.id">
            <div class="card-body">
                <h5 class="card-title text-primary text-center mb-3">{{testament.testamentAddress}}</h5>
                <div class="mb-3">
                    <strong>Creation time:</strong> {{formatTimestamp(testament.creationTimestamp)}}<br/>
                    <strong>Testator name:</strong> {{testament.decryptedInfo.name}}<br/>
                    <strong>Testator email:</strong> {{testament.decryptedInfo.email}}<br/>
                    <strong>Testator address:</strong> {{testament.testatorAddress}}<br/>
                    <strong>Beneficiary name:</strong> {{testament.decryptedInfo.beneficiaryName}}<br/>
                    <strong>Beneficiary email:</strong> {{testament.decryptedInfo.beneficiaryEmail}}<br/>
                    <strong>Beneficiary address:</strong> {{testament.beneficiaryAddress}}<br/>
                    <strong>Execution time:</strong> {{formatTimestamp(testament.executionTimestamp)}}<br/>
                    <strong>Transferred funds:</strong> {{formatBalance(testament.executionBalance)}}<br/>
                </div>
            </div>
        </div>
    </div>    
  </div>
</template>

<script>
import Wallet from "../../js/wallet.js";
import * as Utils from "../../js/utils.js";
import Config from "../../../resources/config.js";

const $ = window.jQuery;

export default {
  name: "AdminPage",

  async created() {
    await this.connect();
  },

  data() {
    return {
      loading: false,
      loadingError: null,

      walletAddress: null,
      processing: false,

      serviceFeeBalance: null,
      inputFeeAmount: "",
      inputServiceKey: "",
      testamentList: null,
    };
  },

  computed: {
    serviceFeesAvailable() {
      return this.serviceFeeBalance.toString() !== "0";
    },

    validServiceKey() {
      return this.inputServiceKey.trim().length > 0;
    },

    notifiableTestaments() {
      return this.testamentList && this.testamentList.notifiable.length > 0;
    },

    executableTestaments() {
      return this.testamentList && this.testamentList.executable.length > 0;
    },

    executedTestaments() {
      return this.testamentList && this.testamentList.executed.length > 0;
    },
  },

  methods: {
    async connect() {
      this.loading = true;
      try {
        let walletInstance = await Wallet.getInstance();

        this.walletAddress = walletInstance.walletAddress;
        this.serviceFeeBalance = await walletInstance.testamentServiceContract.methods.contractBalance().call();

        this.loading = false;
      } catch (err) {
        console.log(err);
        let error = err;
        if (err.message) {
          error = err.message;
        }

        this.loading = false;
        this.loadingError = error;
      }
    },

    isExecutableTestament(testament) {
      let now = Math.floor(new Date().getTime() / 1000);
      let timeSinceLastProofOfLife = now - testament.lastProofOfLifeTimestamp;
      return testament.status === "0" && timeSinceLastProofOfLife > testament.proofOfLifeThreshold;
    },

    isNotifiableTestament(testament) {
      let now = Math.floor(new Date().getTime() / 1000);
      let timeSinceLastProofOfLife = now - testament.lastProofOfLifeTimestamp;
      return testament.status === "0" && timeSinceLastProofOfLife + Config.notifyTheshold >= testament.proofOfLifeThreshold;
    },

    isExecutedTestament(testament) {
      return testament.status === "2";
    },

    processTestaments(testaments) {
      let testamentList = {
        notifiable: [],
        executable: [],
        executed: [],
      };

      let id = 1;
      testaments.forEach((testament) => {
        testament = {...testament};
        testament.id = id++;

        console.log(testament);

        let decryptedEncryptionKey = Utils.decryptUsingServicePrivateKey(this.inputServiceKey, testament.encryptedKey);
        testament.lastProofOfLifeTimestamp = Number(testament.lastProofOfLifeTimestamp);
        testament.proofOfLifeThreshold = Number(testament.proofOfLifeThreshold);
        testament.decryptedInfo = Utils.decryptTestamentInfo(decryptedEncryptionKey, testament.encryptedInfo);

        if (this.isExecutedTestament(testament)) {
          testamentList.executed.push(testament);
        } else if (this.isExecutableTestament(testament)) {
          testamentList.executable.push(testament);
        } else if (this.isNotifiableTestament(testament)) {
          testamentList.notifiable.push(testament);
        }
      });

      return testamentList;
    },

    formatTimestamp(timestamp) {
      return new Date(timestamp * 1000).toISOString().replace("T", " ").replace(".000Z", "") + " UTC";
    },

    formatBalance(balance) {
      return Utils.formatUnit(Utils.toBN(balance), 18) + " rBTC";
    },

    formatUnlockTimestamp(testament) {
      return this.formatTimestamp(testament.lastProofOfLifeTimestamp + testament.proofOfLifeThreshold);
    },

    async listTestaments() {
      this.processing = true;
      this.testamentList = null;

      try {
        let walletInstance = await Wallet.getInstance();
        let testaments = await walletInstance.testamentServiceContract.methods.testaments().call();
        console.log(testaments);
        this.testamentList = this.processTestaments(testaments);
        this.processing = false;
      } catch (err) {
        this.processing = false;
        console.log(err);

        // Error 4001 means that user just denied the signature of the transaction, no need to show an error.
        // The 'Invalid JSON RPC response' is a workaround for the RSK wallet which doesn't provide a good error code...
        if (err.code !== 4001 && String(err).indexOf("Invalid JSON RPC response") === -1) {
          let errorMsg = err;
          if (err.message && err.message.trim().length > 0) {
            errorMsg = err.message;
          }
          $("#errorMsg").text(errorMsg);
          $("#errorModal").modal("show");
        }
      }
    },

    async executeTestament(testatorAddress) {
      let ctx = this;
      this.processing = true;

      function onError(err) {
        ctx.processing = false;
        console.log(err);

        // Error 4001 means that user just denied the signature of the transaction, no need to show an error.
        // The 'Invalid JSON RPC response' is a workaround for the RSK wallet which doesn't provide a good error code...
        if (err.code !== 4001 && String(err).indexOf("Invalid JSON RPC response") === -1) {
          let errorMsg = err;
          if (err.message && err.message.trim().length > 0) {
            errorMsg = err.message;
          }
          $("#errorMsg").text(errorMsg);
          $("#errorModal").modal("show");
        }
      }

      let walletInstance = await Wallet.getInstance();

      Utils.invokeMethodAndWaitConfirmation(
        walletInstance.web3Instance,
        walletInstance.testamentServiceContract.methods.executeTestamentOf(testatorAddress),
        walletInstance.walletAddress,
        async function () {
          try {
            let testaments = await walletInstance.testamentServiceContract.methods.testaments().call();
            ctx.testamentList = ctx.processTestaments(testaments);
            ctx.processing = false;
          } catch (err) {
            onError(err);
          }
        },
        function (err) {
          onError(err);
        }
      );
    },

    async withdrawServiceFees() {
      let ctx = this;
      this.processing = true;

      function onError(err) {
        ctx.processing = false;
        console.log(err);

        // Error 4001 means that user just denied the signature of the transaction, no need to show an error.
        // The 'Invalid JSON RPC response' is a workaround for the RSK wallet which doesn't provide a good error code...
        if (err.code !== 4001 && String(err).indexOf("Invalid JSON RPC response") === -1) {
          let errorMsg = err;
          if (err.message && err.message.trim().length > 0) {
            errorMsg = err.message;
          }
          $("#errorMsg").text(errorMsg);
          $("#errorModal").modal("show");
        }
      }

      let walletInstance = await Wallet.getInstance();

      Utils.invokeMethodAndWaitConfirmation(
        walletInstance.web3Instance,
        walletInstance.testamentServiceContract.methods.withdrawServiceFees(),
        walletInstance.walletAddress,
        async function () {
          try {
            ctx.serviceFeeBalance = Utils.toBN(await walletInstance.testamentServiceContract.methods.contractBalance().call());
            ctx.inputFeeAmount = "";
            ctx.processing = false;
          } catch (err) {
            onError(err);
          }
        },
        function (err) {
          onError(err);
        }
      );
    },
  },
};

</script>
