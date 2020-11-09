const ObjectsToCsv = require('objects-to-csv')

let createCsv = async()=>{
    let list = [
        {
          'SR No.': 1,
          Card_No: '10165305',
          Bill_No: '414638',
          BillDate: '14-Oct-2019',
          BillTime: '20:34',
          Actual_Pax: '5',
          Pos_Code: '0002',
          Food: '8250',
          Disc_Food: '2475',
          Soft_Bev: '0',
          Disc_Soft_Bev: '0',
          Dom_Liq: '0',
          Disc_Dom_Liq: '0',
          Imp_Liq: '0',
          Disc_Imp_Liq: '0',
          Tobacco: '0',
          Disc_Tobacco: '0',
          Misc: '0',
          Grossbilltotal: '8250',
          Disc_Misc: '0',
          Tax: '1179',
          status: 'SYNC_ERROR',
          error_description: 'duplicate record'
        },
        {
          'SR No.': 2,
          Card_No: '10178607',
          Bill_No: '414639',
          BillDate: '14-Oct-2019',
          BillTime: '21:19',
          Actual_Pax: '2',
          Pos_Code: '0002',
          Food: '1975',
          Disc_Food: '720',
          Soft_Bev: '0',
          Disc_Soft_Bev: '0',
          Dom_Liq: '0',
          Disc_Dom_Liq: '0',
          Imp_Liq: '0',
          Disc_Imp_Liq: '0',
          Tobacco: '0',
          Disc_Tobacco: '0',
          Misc: '0',
          Grossbilltotal: '1975',
          Disc_Misc: '0',
          Tax: '284',
          status: 'SYNC_ERROR',
          error_description: 'duplicate record'
        },
        {
          'SR No.': 3,
          Card_No: '10001441',
          Bill_No: '414696',
          BillDate: '15-Oct-2019',
          BillTime: '20:15',
          Actual_Pax: '3',
          Pos_Code: '0002',
          Food: '5250',
          Disc_Food: '2625',
          Soft_Bev: '150',
          Disc_Soft_Bev: '0',
          Dom_Liq: '0',
          Disc_Dom_Liq: '0',
          Imp_Liq: '0',
          Disc_Imp_Liq: '0',
          Tobacco: '0',
          Disc_Tobacco: '0',
          Misc: '0',
          Grossbilltotal: '5400',
          Disc_Misc: '0',
          Tax: '499',
          status: 'SYNC_ERROR',
          error_description: 'duplicate record'
        },
        {
          'SR No.': 4,
          Card_No: '107051558',
          Bill_No: '414652',
          BillDate: '15-Oct-2019',
          BillTime: '21:14',
          Actual_Pax: '10',
          Pos_Code: '0002',
          Food: '8175',
          Disc_Food: '4087',
          Soft_Bev: '0',
          Disc_Soft_Bev: '0',
          Dom_Liq: '0',
          Disc_Dom_Liq: '0',
          Imp_Liq: '0',
          Disc_Imp_Liq: '0',
          Tobacco: '0',
          Disc_Tobacco: '0',
          Misc: '0',
          Grossbilltotal: '8175',
          Disc_Misc: '0',
          Tax: '3736',
          status: 'SYNC_ERROR',
          error_description: 'duplicate record'
        }
      ]
    const csv = new ObjectsToCsv(list)
    await csv.toDisk('./list.csv')    
}


createCsv().then(d=>{
    console.log(d)
}).catch(e=>{
    console.log(e)
})

