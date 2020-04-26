App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },


  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }

    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    const regionList = await $.getJSON('Hotspots.json')
    App.contracts.regionList = TruffleContract(regionList)
    App.contracts.regionList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.regionList = await App.contracts.regionList.deployed()
  },

  render: async () => {
    if (App.loading) {
      return
    }
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)
    await App.renderTasks()
    App.setLoading(false)
  },

  renderTasks: async () => {
    const regionCount = await App.regionList.regionCount()
    const $taskTemplate = $('.taskTemplate')

    for (var i = 1; i <= regionCount; i++) {
      const region= await App.regionList.tasks(i)
      const regionID = task[0].toNumber()
      const regionName = task[1]
      const regionSafe = task[2]

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(regionName)
      $newTaskTemplate.find('input')
                      .prop('name', regionID)
                      .prop('checked', regionSafe)
                      .on('click', App.toggleCompleted)

      if (regionSafe) {
        $('#Hotspots List').append($newTaskTemplate)
      } else {
        $('#Hotspots List').append($newTaskTemplate)
      }

      $newTaskTemplate.show()
    }
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newArea').val()
    await App.regionList.createTask(content)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const regionID = e.target.name
    await App.regionList.toggleCompleted(regionID)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
