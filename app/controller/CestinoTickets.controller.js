sap.ui.define(
  [
    "rapportini/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],

  function (BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("rapportini.controller.CestinoTickets", {
      onInit: function () {
        var oRouter = this.getRouter();
        oRouter
          .getRoute("cestinoTickets")
          .attachPatternMatched(this.onPatternMatched, this);
      },

      onPatternMatched: function () {
        this.onRefresh();
      },

      onRefresh: function () {
        /*var oTable = this.getView().byId("tableRapportiniCestinatiID");
          var oBinding = oTable.getBinding("items");
          oBinding.refresh();*/
        this.getOwnerComponent().getModel().refresh();
      },
      onNavToTickets: function () {
        this.getRouter().navTo("tickets");
      },
      onRestoreTicket: async function (elementID) {
        var oModel = await this.getView().getModel();
        var contexts = await oModel
          .bindList("/TicketsCestinati")
          .requestContexts();
        var tickets = contexts.map((x) => x.getObject());

        let value = tickets.find((element) => {
          return element.ID === elementID;
        });
        let index = tickets.indexOf(value);

        var oBindingCestino = await oModel.bindList("/Tickets");
        oBindingCestino.create(tickets[index]);
        oModel.submitBatch("myAppUpdateGroup");

        oModel.delete("/TicketsCestinati(" + elementID + ")", "$auto");
        MessageToast.show("Elemento ripristinato");
      },

      onDeleteTicket: async function (elementID) {
        var oModel = await this.getView().getModel();
        MessageBox.confirm("Eliminare definitivamente?", {
          title: "Confirm",
          onClose: function (oAction) {
            if (oAction == "OK") {
              {
                oModel.delete("/TicketsCestinati(" + elementID + ")", "$auto");
                MessageToast.show("Elemento cancellato definitivamente");
              }
            }
          },
          styleClass: "",
          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
          emphasizedAction: sap.m.MessageBox.Action.OK,
          initialFocus: null,
          textDirection: sap.ui.core.TextDirection.Inherit,
        });
      },

      onDeleteAll: async function () {
        var oModel = await this.getView().getModel();
        var contexts = await oModel
          .bindList("/TicketsCestinati")
          .requestContexts();
        var tickets = contexts.map((x) => x.getObject());

        MessageBox.confirm("Eliminare definitivamente?", {
          title: "Confirm",
          onClose: function (oAction) {
            if (oAction == "OK") {
              {
                for (let index = 0; index < tickets.length; index++) {
                  const element = tickets[index].ID;
                  oModel.delete("/TicketsCestinati(" + element + ")", "$auto");
                }

                MessageToast.show("Elementi cancellato definitivamente");
              }
            }
          },
          styleClass: "",
          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
          emphasizedAction: sap.m.MessageBox.Action.OK,
          initialFocus: null,
          textDirection: sap.ui.core.TextDirection.Inherit,
        });
      },

      onRestoreAll: async function () {
        var oModel = await this.getView().getModel();
        var contexts = await oModel
          .bindList("/TicketsCestinati")
          .requestContexts();
        var tickets = contexts.map((x) => x.getObject());

        var oBindingCestino = await oModel.bindList("/Tickets");

        MessageBox.confirm("Ripristinare tutto?", {
          title: "Confirm",
          onClose: function (oAction) {
            if (oAction == "OK") {
              {
                for (let index = 0; index < tickets.length; index++) {
                  oBindingCestino.create(tickets[index]);
                  const element = tickets[index].ID;
                  oModel.delete("/TicketsCestinati(" + element + ")", "$auto");
                }
                oModel.submitBatch("myAppUpdateGroup");
                MessageToast.show("Elementi ripristinati");
              }
            }
          },
          styleClass: "",
          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
          emphasizedAction: sap.m.MessageBox.Action.OK,
          initialFocus: null,
          textDirection: sap.ui.core.TextDirection.Inherit,
        });
      },
      onBindingChange: function (oEvent) {
        this.getView()
          .byId("tabella")
          .setVisibleRowCount(oEvent.getSource().getLength());
      },
      onColumnResize: function (oEvent) {
        var oColumn = oEvent.getParameter("column");

        if (this.byId("toolColumn") == oColumn) {
          oEvent.preventDefault();
        }
      },
    });
  }
);
