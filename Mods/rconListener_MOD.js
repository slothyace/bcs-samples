module.exports = {
  data: {
    name: "RCON Listener",
  },
  category: "RCON",
  info: {
    source: "https://github.com/slothyace/BCS/tree/main/Mods",
    creator: "Acedia",
    donate: "https://ko-fi.com/slothyacedia",
  },
  modules: ["rcon"],
  UI: [
    {
      element: "input",
      storeAs: "ipAddress",
      name: "RCON Server IP Address",
    },
    {
      element: "input",
      storeAs: "ipPort",
      name: "RCON Server Port",
    },
    {
      element: "input",
      storeAs: "rconPassword",
      name: "RCON Server Password",
    },
    {
      element: "toggle",
      storeAs: "tcpudp",
      name: "TCP / UDP",
      true: "TCP",
      false: "UDP",
    },
    {
      element: "toggle",
      storeAs: "challengePtc",
      name: "Use Challenge Protocol"
    },
    "-",
    {
      element: "toggle",
      storeAs: "maintain",
      name: "Maintain Connection",
    },
    {
      element: "store",
      storeAs: "serverMessage",
      name: "Store RCON Server Message As",
    },
    {
      element: "actions",
      storeAs: "toRunAct",
      name: "Run actions",
    }
  ],

  subtitle: (values) => {
    return `Listen to ${values.ipAddress}:${values.ipPort}, maintained: ${values.maintain}`
  },

  compatibility: ["Any"],

  async run(values, interaction, client, bridge){
    const Rcon = require("rcon")

    var config = {
      tcp: bridge.transf(values.tcpudp),
      challenge: bridge.transf(values.challengePtc)
    }

    ipAddr = bridge.transf(values.ipAddress)
    ipPort = bridge.transf(values.ipPort)
    rconPw = bridge.transf(values.rconPassword)

    const rconServer = new Rcon(ipAddr, ipPort, rconPw, config)

    rconServer.on("auth", function(){
      console.log(`Connection made with ${ipAddr}:${ipPort}, authentication success.`)
    }).on("error", function(err){
      console.log(`Error: ${str}`)
    }).on("end", function(){
      if (bridge.transf(values.maintain) == true){
        console.log(`Connection with ${ipAddr}:${ipPort} dropped, attempting reconnecting.`)
        rconServer.connect()
      }
    }).on("response", function (str) {
      console.log(str)
      bridge.store(values.serverMessage, str);
      bridge.runner(values.toRunAct);
    }).on("server", function (str) {
      console.log(str)
      bridge.store(values.serverMessage, str);
      bridge.runner(values.toRunAct);
    })
    
    rconServer.connect()

  }
}