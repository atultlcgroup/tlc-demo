let data = [
    {
      'SR No.': 1,
      'Property Name': 'JW Marriott Hotel New Delhi Aerocity',
      Member: 'Pras Hant',
      'Membership Number': 'JW Aerocity Level 1',
      'Membership Type': '106175913',
      'CSV Serial Number': '1',
      'Bank Id': '930',
      'Bank Name': 'Canara Bank',
      'TPSL Transaction Id': '1274403894',
      'SM Transaction Id': '7442997',
      'Bank Transaction Id': '1.87E+14',
      'Total Amount': '100',
      Charges: '0',
      'Service Tax': '0',
      'Net Amount': '100',
      'Transaction Date': '10/23/2020',
      'Transaction Time': '08:12:49:1249',
      'Payment Date': '00:00.0',
      'SRC ITC': '{email:prashant.kumar@tlcgroup1.com}{mob:918178247871}',
      Scheme: 'SECOND',
      Schemeamount: '14750',
      ErrorDescription: 'Deplicate Record'
    },
    {
      'SR No.': 2,
      'Property Name': 'JW Marriott Hotel New Delhi Aerocity',
      Member: 'Kushal Chandel',
      'Membership Number': 'JW Aerocity Level 1',
      'Membership Type': '107124863',
      'CSV Serial Number': '2',
      'Bank Id': '1370',
      'Bank Name': 'RuPay',
      'TPSL Transaction Id': '1273394494',
      'SM Transaction Id': '3782360',
      'Bank Transaction Id': '2.02E+14',
      'Total Amount': '900',
      Charges: '100',
      'Service Tax': '62',
      'Net Amount': '1062',
      'Transaction Date': '10/23/2020',
      'Transaction Time': '09:56:04:564',
      'Payment Date': '00:00.0',
      'SRC ITC': '{email:kushal.chandel@tlcgroup.com}{mob:919958914559}',
      Scheme: 'SECOND',
      Schemeamount: '10325',
      ErrorDescription: 'Deplicate Record'
    }
  ]


  console.log(JSON.parse(JSON.stringify(data)))