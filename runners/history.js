const History = require("../models/History.js");
const _ = require("lodash");
const fetch = require("node-fetch");
const FarmStatistics = require("../models/FarmStatistics.js");

class HistoryCollection {
  static async completed(printer) {
    let newPrintHistory = await HistoryCollection.history();
    let historyCollection = await History.find({});
    newPrintHistory.notes = "";
    //Check last print date.
    HistoryCollection.get(
      printer.ip,
      printer.port,
      printer.apikey,
      "files/local/" + printer.job.file.path
    )
      .then(res => {
        return res.json();
      })
      .then(async res => {
        if (historyCollection.length < 1) {
          newPrintHistory.old = false;

          newPrintHistory.printerIndex = printer.index;
          newPrintHistory.printerName = printer.settingsApperance.name;
          newPrintHistory.success = true;
          newPrintHistory.fileName = printer.job.file.display;
          newPrintHistory.filePath = printer.job.file.path;
          let startDate = await new Date(res.prints.last.date * 1000);
          let dateStart = await startDate.toDateString();
          let timeStart = await startDate.toTimeString();
          let newStart = timeStart.substring(0, 8);
          newPrintHistory.startDate = dateStart + " - " + newStart;
          let printTime = new Date(printer.progress.printTime * 1000);
          let dateEnd = startDate.getTime() + printTime.getTime();
          let isoDateEnd = new Date(dateEnd);
          let yearEnd = await isoDateEnd.toDateString();
          let timeEnd = await isoDateEnd.toTimeString();
          let newEnd = timeEnd.substring(0, 8);
          newPrintHistory.endDate = yearEnd + " - " + newEnd;
          newPrintHistory.id = res.prints.last.date + printer.job.file.name;
          newPrintHistory.printTime = printer.progress.printTime;
          newPrintHistory.spoolUsed = ""; // Awaiting link for spools - print.currentSpool.
          newPrintHistory.filamentLength = printer.job.filament.tool0.length;
          newPrintHistory.filamentVolume = printer.job.filament.tool0.volume;
          let printHistory = newPrintHistory;
          let newHistory = new History({
            printHistory
          });
          newHistory.save();
        } else {
          //Save if this print is different to last print date.
          //setup newHistory
          newPrintHistory.old = false;

          newPrintHistory.printerIndex = printer.index;
          newPrintHistory.printerName = printer.settingsApperance.name;
          newPrintHistory.success = true;
          newPrintHistory.fileName = printer.job.file.display;
          newPrintHistory.filePath = printer.job.file.path;
          if (typeof res.prints.last.date != "undefined") {
            let startDate = await new Date(res.prints.last.date * 1000);
            let dateStart = await startDate.toDateString();
            let timeStart = await startDate.toTimeString();
            let newStart = timeStart.substring(0, 8);
            newPrintHistory.startDate = dateStart + " - " + newStart;
            let printTime = new Date(printer.progress.printTime * 1000);
            let dateEnd = startDate.getTime() + printTime.getTime();
            let isoDateEnd = new Date(dateEnd);
            let yearEnd = await isoDateEnd.toDateString();
            let timeEnd = await isoDateEnd.toTimeString();
            let newEnd = timeEnd.substring(0, 8);
            newPrintHistory.endDate = yearEnd + " - " + newEnd;
            newPrintHistory.id = res.prints.last.date + printer.job.file.name;
            newPrintHistory.printTime = printer.progress.printTime;
            newPrintHistory.spoolUsed = ""; // Awaiting link for spools - print.currentSpool.
            newPrintHistory.filamentLength = printer.job.filament.tool0.length;
            newPrintHistory.filamentVolume = printer.job.filament.tool0.volume;
            //Search and see if print exists in db...
            History.findOne({
              "printHistory.id": res.prints.last.date + printer.job.file.name
            })
              .then(res => {
                if (res === null) {
                  let printHistory = newPrintHistory;
                  let newHistory = new History({
                    printHistory
                  });
                  newHistory.save();
                  console.log(
                    "Saved: " + res.prints.last.date + printer.job.file.name
                  );
                }
              })
              .catch(err => console.log("ERROR ALREADY IN DATABASE: " + res));
          }
        }
      })
      .catch(err => console.log("ERROR GRABBING FILE INFO:" + err));
  }
  static async failed(printer) {
    let newPrintHistory = await HistoryCollection.history();
    let historyCollection = await History.find({});
    newPrintHistory.notes = "";
    //Check last print date.
    HistoryCollection.get(
      printer.ip,
      printer.port,
      printer.apikey,
      "files/local/" + printer.job.file.path
    )
      .then(res => {
        return res.json();
      })
      .then(async res => {
        if (historyCollection.length < 1) {
          newPrintHistory.old = false;

          newPrintHistory.printerIndex = printer.index;
          newPrintHistory.printerName = printer.settingsApperance.name;
          newPrintHistory.success = false;
          newPrintHistory.fileName = printer.job.file.display;
          newPrintHistory.filePath = printer.job.file.path;
          let startDate = await new Date(res.prints.last.date * 1000);
          let dateStart = await startDate.toDateString();
          let timeStart = await startDate.toTimeString();
          let newStart = timeStart.substring(0, 8);
          newPrintHistory.startDate = dateStart + " - " + newStart;
          let printTime = new Date();
          let printTimeNew =
            printTime.getMilliseconds() - startDate.getMilliseconds();
          let dateEnd = startDate.getTime() + printTime;
          let isoDateEnd = new Date(dateEnd);
          let yearEnd = await isoDateEnd.toDateString();
          let timeEnd = await isoDateEnd.toTimeString();
          let newEnd = timeEnd.substring(0, 8);
          newPrintHistory.endDate = yearEnd + " - " + newEnd;
          newPrintHistory.id = res.prints.last.date + printer.job.file.name;
          newPrintHistory.printTime = printTime;
          newPrintHistory.spoolUsed = ""; // Awaiting link for spools - print.currentSpool.
          newPrintHistory.filamentLength = printer.job.filament.tool0.length;
          newPrintHistory.filamentVolume = printer.job.filament.tool0.volume;
          let printHistory = newPrintHistory;
          let newHistory = new History({
            printHistory
          });
          newHistory.save();
        } else {
          //Save if this print is different to last print date.
          //setup newHistory
          newPrintHistory.old = false;

          newPrintHistory.printerIndex = printer.index;
          newPrintHistory.printerName = printer.settingsApperance.name;
          newPrintHistory.success = false;
          newPrintHistory.fileName = printer.job.file.display;
          newPrintHistory.filePath = printer.job.file.path;
          if (typeof res.prints.last.date != "undefined") {
            let startDate = await new Date(res.prints.last.date * 1000);
            let dateStart = await startDate.toDateString();
            let timeStart = await startDate.toTimeString();
            let newStart = timeStart.substring(0, 8);
            newPrintHistory.startDate = dateStart + " - " + newStart;
            let printTime = new Date();
            let printTimeNew =
              printTime.getMilliseconds() - startDate.getMilliseconds();
            let dateEnd = startDate.getTime() + printTime;
            let isoDateEnd = new Date(dateEnd);
            let yearEnd = await isoDateEnd.toDateString();
            let timeEnd = await isoDateEnd.toTimeString();
            let newEnd = timeEnd.substring(0, 8);
            newPrintHistory.endDate = yearEnd + " - " + newEnd;
            newPrintHistory.id = res.prints.last.date + printer.job.file.name;
            newPrintHistory.printTime = printTime;
            newPrintHistory.spoolUsed = ""; // Awaiting link for spools - print.currentSpool.
            newPrintHistory.filamentLength = printer.job.filament.tool0.length;
            newPrintHistory.filamentVolume = printer.job.filament.tool0.volume;
            //Search and see if print exists in db...
            History.findOne({
              "printHistory.id": res.prints.last.date + printer.job.file.name
            })
              .then(res => {
                if (res === null) {
                  let printHistory = newPrintHistory;
                  let newHistory = new History({
                    printHistory
                  });
                  newHistory.save();
                  console.log(
                    "Saved: " + res.prints.last.date + printer.job.file.name
                  );
                }
              })
              .catch(err => console.log("ERROR ALREADY IN DATABASE: " + res));
          }
        }
      })
      .catch(err => console.log("ERROR GRABBING FILE INFO:" + err));
  }
  static async increment(type) {
    let farmInfo = await FarmStatistics.find({});
    farmInfo = farmInfo[0].farmInfo;
  }
  static history() {
    let printHistory = {
      old: false,
      id: 0,
      printerIndex: 0,
      printerName: "",
      success: true,
      fileName: "",
      filePath: "",
      startDate: "",
      endDate: "",
      printTime: "",
      spoolUsed: "",
      filamentLength: 0,
      filamentVolume: 0,
      notes: ""
    };
    return printHistory;
  }

  static get(ip, port, apikey, item) {
    let url = `http://${ip}:${port}/api/${item}`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apikey
      }
    });
  }
}

module.exports = {
  HistoryCollection: HistoryCollection
};
