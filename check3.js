let fs = require('fs')
var obj = {
        "ENVELOPE": {
            "HEADER": {
                "TALLYREQUEST": {
                    "_text": "Import Data"
                }
            },
            "BODY": {
                "IMPORTDATA": {
                    "REQUESTDESC": {
                        "REPORTNAME": {
                            "_text": "All Masters"
                        },
                        "STATICVARIABLES": {
                            "SVCURRENTCOMPANY": {
                                "_text": "VnV Tect Co"
                            }
                        }
                    },
                    "REQUESTDATA": {
                        "TALLYMESSAGE": {
                            "_attributes": {
                                "xmlns:UDF": "TallyUDF"
                            },
                            "LEDGER": {
                                "_attributes": {
                                    "NAME": "Mrinal Khurana-113753",
                                    "RESERVEDNAME": ""
                                },
                                "ADDRESS.LIST": {
                                    "_attributes": {
                                        "TYPE": "String"
                                    },
                                    "ADDRESS": [
                                        {
                                            "_text": "dawarka sec-10 B-22 navyog apartments"
                                        },
                                        {
                                            "_text": "New Delhi"
                                        }
                                    ]
                                },
                                "MAILINGNAME.LIST": {
                                    "_attributes": {
                                        "TYPE": "String"
                                    },
                                    "MAILINGNAME": {
                                        "_text": "Mrinal Khurana-113753"
                                    }
                                },
                                "OLDAUDITENTRYIDS.LIST": {
                                    "_attributes": {
                                        "TYPE": "Number"
                                    },
                                    "OLDAUDITENTRYIDS": {
                                        "_text": "-1"
                                    }
                                },
                                "CREATEDDATE": {
                                    "_text": "20200908"
                                },
                                "ALTEREDON": {
                                    "_text": "20200908"
                                },
                                "GUID": {
                                    "_text": "f654a57e-d3bc-4b86-90f5-28406b2c19ec-00000182"
                                },
                                "CURRENCYNAME": {
                                    "_text": "₹"
                                },
                                "EMAIL": {
                                    "_text": "venu@vnv.ca"
                                },
                                "PRIORSTATENAME": {
                                    "_text": "Delhi"
                                },
                                "COUNTRYNAME": {
                                    "_text": "India"
                                },
                                "GSTREGISTRATIONTYPE": {
                                    "_text": "Regular"
                                },
                                "PARENT": {
                                    "_text": "Sundry Debtors"
                                },
                                "CREATEDBY": {
                                    "_text": "a"
                                },
                                "ALTEREDBY": {
                                    "_text": "a"
                                },
                                "TAXCLASSIFICATIONNAME": {},
                                "TAXTYPE": {
                                    "_text": "Others"
                                },
                                "COUNTRYOFRESIDENCE": {
                                    "_text": "India"
                                },
                                "DESCRIPTION": {
                                    "_text": "The Westin Gurgaon New Delhi"
                                },
                                "LEDGERCONTACT": {
                                    "_text": "Mrinal"
                                },
                                "LEDGERMOBILE": {
                                    "_text": "8989823822"
                                },
                                "GSTTYPE": {},
                                "APPROPRIATEFOR": {},
                                "PARTYGSTIN": {
                                    "_text": "07AAJG1029NZ01"
                                },
                                "LEDSTATENAME": {
                                    "_text": "Delhi"
                                },
                                "SERVICECATEGORY": {
                                    "_text": "\u0004 Not Applicable"
                                },
                                "EXCISELEDGERCLASSIFICATION": {},
                                "EXCISEDUTYTYPE": {},
                                "EXCISENATUREOFPURCHASE": {},
                                "LEDGERFBTCATEGORY": {},
                                "ISBILLWISEON": {
                                    "_text": "Yes"
                                },
                                "ISCOSTCENTRESON": {
                                    "_text": "No"
                                },
                                "ISINTERESTON": {
                                    "_text": "No"
                                },
                                "ALLOWINMOBILE": {
                                    "_text": "No"
                                },
                                "ISCOSTTRACKINGON": {
                                    "_text": "No"
                                },
                                "ISBENEFICIARYCODEON": {
                                    "_text": "No"
                                },
                                "PLASINCOMEEXPENSE": {
                                    "_text": "No"
                                },
                                "ISUPDATINGTARGETID": {
                                    "_text": "No"
                                },
                                "ASORIGINAL": {
                                    "_text": "Yes"
                                },
                                "ISCONDENSED": {
                                    "_text": "No"
                                },
                                "AFFECTSSTOCK": {
                                    "_text": "No"
                                },
                                "ISRATEINCLUSIVEVAT": {
                                    "_text": "No"
                                },
                                "FORPAYROLL": {
                                    "_text": "No"
                                },
                                "ISABCENABLED": {
                                    "_text": "No"
                                },
                                "ISCREDITDAYSCHKON": {
                                    "_text": "No"
                                },
                                "INTERESTONBILLWISE": {
                                    "_text": "No"
                                },
                                "OVERRIDEINTEREST": {
                                    "_text": "No"
                                },
                                "OVERRIDEADVINTEREST": {
                                    "_text": "No"
                                },
                                "USEFORVAT": {
                                    "_text": "No"
                                },
                                "IGNORETDSEXEMPT": {
                                    "_text": "No"
                                },
                                "ISTCSAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISTDSAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISFBTAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISGSTAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISEXCISEAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISTDSEXPENSE": {
                                    "_text": "No"
                                },
                                "ISEDLIAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISRELATEDPARTY": {
                                    "_text": "No"
                                },
                                "USEFORESIELIGIBILITY": {
                                    "_text": "No"
                                },
                                "ISINTERESTINCLLASTDAY": {
                                    "_text": "No"
                                },
                                "APPROPRIATETAXVALUE": {
                                    "_text": "No"
                                },
                                "ISBEHAVEASDUTY": {
                                    "_text": "No"
                                },
                                "INTERESTINCLDAYOFADDITION": {
                                    "_text": "No"
                                },
                                "INTERESTINCLDAYOFDEDUCTION": {
                                    "_text": "No"
                                },
                                "ISOTHTERRITORYASSESSEE": {
                                    "_text": "No"
                                },
                                "OVERRIDECREDITLIMIT": {
                                    "_text": "No"
                                },
                                "ISAGAINSTFORMC": {
                                    "_text": "No"
                                },
                                "ISCHEQUEPRINTINGENABLED": {
                                    "_text": "Yes"
                                },
                                "ISPAYUPLOAD": {
                                    "_text": "No"
                                },
                                "ISPAYBATCHONLYSAL": {
                                    "_text": "No"
                                },
                                "ISBNFCODESUPPORTED": {
                                    "_text": "No"
                                },
                                "ALLOWEXPORTWITHERRORS": {
                                    "_text": "No"
                                },
                                "CONSIDERPURCHASEFOREXPORT": {
                                    "_text": "No"
                                },
                                "ISTRANSPORTER": {
                                    "_text": "No"
                                },
                                "USEFORNOTIONALITC": {
                                    "_text": "No"
                                },
                                "ISECOMMOPERATOR": {
                                    "_text": "No"
                                },
                                "SHOWINPAYSLIP": {
                                    "_text": "No"
                                },
                                "USEFORGRATUITY": {
                                    "_text": "No"
                                },
                                "ISTDSPROJECTED": {
                                    "_text": "No"
                                },
                                "FORSERVICETAX": {
                                    "_text": "No"
                                },
                                "ISINPUTCREDIT": {
                                    "_text": "No"
                                },
                                "ISEXEMPTED": {
                                    "_text": "No"
                                },
                                "ISABATEMENTAPPLICABLE": {
                                    "_text": "No"
                                },
                                "ISSTXPARTY": {
                                    "_text": "No"
                                },
                                "ISSTXNONREALIZEDTYPE": {
                                    "_text": "No"
                                },
                                "ISUSEDFORCVD": {
                                    "_text": "No"
                                },
                                "LEDBELONGSTONONTAXABLE": {
                                    "_text": "No"
                                },
                                "ISEXCISEMERCHANTEXPORTER": {
                                    "_text": "No"
                                },
                                "ISPARTYEXEMPTED": {
                                    "_text": "No"
                                },
                                "ISSEZPARTY": {
                                    "_text": "No"
                                },
                                "TDSDEDUCTEEISSPECIALRATE": {
                                    "_text": "No"
                                },
                                "ISECHEQUESUPPORTED": {
                                    "_text": "No"
                                },
                                "ISEDDSUPPORTED": {
                                    "_text": "No"
                                },
                                "HASECHEQUEDELIVERYMODE": {
                                    "_text": "No"
                                },
                                "HASECHEQUEDELIVERYTO": {
                                    "_text": "No"
                                },
                                "HASECHEQUEPRINTLOCATION": {
                                    "_text": "No"
                                },
                                "HASECHEQUEPAYABLELOCATION": {
                                    "_text": "No"
                                },
                                "HASECHEQUEBANKLOCATION": {
                                    "_text": "No"
                                },
                                "HASEDDDELIVERYMODE": {
                                    "_text": "No"
                                },
                                "HASEDDDELIVERYTO": {
                                    "_text": "No"
                                },
                                "HASEDDPRINTLOCATION": {
                                    "_text": "No"
                                },
                                "HASEDDPAYABLELOCATION": {
                                    "_text": "No"
                                },
                                "HASEDDBANKLOCATION": {
                                    "_text": "No"
                                },
                                "ISEBANKINGENABLED": {
                                    "_text": "No"
                                },
                                "ISEXPORTFILEENCRYPTED": {
                                    "_text": "No"
                                },
                                "ISBATCHENABLED": {
                                    "_text": "No"
                                },
                                "ISPRODUCTCODEBASED": {
                                    "_text": "No"
                                },
                                "HASEDDCITY": {
                                    "_text": "No"
                                },
                                "HASECHEQUECITY": {
                                    "_text": "No"
                                },
                                "ISFILENAMEFORMATSUPPORTED": {
                                    "_text": "No"
                                },
                                "HASCLIENTCODE": {
                                    "_text": "No"
                                },
                                "PAYINSISBATCHAPPLICABLE": {
                                    "_text": "No"
                                },
                                "PAYINSISFILENUMAPP": {
                                    "_text": "No"
                                },
                                "ISSALARYTRANSGROUPEDFORBRS": {
                                    "_text": "No"
                                },
                                "ISEBANKINGSUPPORTED": {
                                    "_text": "No"
                                },
                                "ISSCBUAE": {
                                    "_text": "No"
                                },
                                "ISBANKSTATUSAPP": {
                                    "_text": "No"
                                },
                                "ISSALARYGROUPED": {
                                    "_text": "No"
                                },
                                "USEFORPURCHASETAX": {
                                    "_text": "No"
                                },
                                "AUDITED": {
                                    "_text": "No"
                                },
                                "SORTPOSITION": {
                                    "_text": " 1000"
                                },
                                "ALTERID": {
                                    "_text": " 1106"
                                },
                                "SERVICETAXDETAILS.LIST": {},
                                "LBTREGNDETAILS.LIST": {},
                                "VATDETAILS.LIST": {},
                                "SALESTAXCESSDETAILS.LIST": {},
                                "GSTDETAILS.LIST": {},
                                "LANGUAGENAME.LIST": {
                                    "NAME.LIST": {
                                        "_attributes": {
                                            "TYPE": "String"
                                        },
                                        "NAME": [
                                            {
                                                "_text": "Mrinal Khurana-113753"
                                            },
                                            {
                                                "_text": "113753"
                                            }
                                        ]
                                    },
                                    "LANGUAGEID": {
                                        "_text": " 1033"
                                    }
                                },
                                "XBRLDETAIL.LIST": {},
                                "AUDITDETAILS.LIST": {},
                                "SCHVIDETAILS.LIST": {},
                                "EXCISETARIFFDETAILS.LIST": {},
                                "TCSCATEGORYDETAILS.LIST": {},
                                "TDSCATEGORYDETAILS.LIST": {},
                                "SLABPERIOD.LIST": {},
                                "GRATUITYPERIOD.LIST": {},
                                "ADDITIONALCOMPUTATIONS.LIST": {},
                                "EXCISEJURISDICTIONDETAILS.LIST": {},
                                "EXCLUDEDTAXATIONS.LIST": {},
                                "BANKALLOCATIONS.LIST": {},
                                "PAYMENTDETAILS.LIST": {},
                                "BANKEXPORTFORMATS.LIST": {},
                                "BILLALLOCATIONS.LIST": {},
                                "INTERESTCOLLECTION.LIST": {},
                                "LEDGERCLOSINGVALUES.LIST": {},
                                "LEDGERAUDITCLASS.LIST": {},
                                "OLDAUDITENTRIES.LIST": {},
                                "TDSEXEMPTIONRULES.LIST": {},
                                "DEDUCTINSAMEVCHRULES.LIST": {},
                                "LOWERDEDUCTION.LIST": {},
                                "STXABATEMENTDETAILS.LIST": {},
                                "LEDMULTIADDRESSLIST.LIST": {},
                                "STXTAXDETAILS.LIST": {},
                                "CHEQUERANGE.LIST": {},
                                "DEFAULTVCHCHEQUEDETAILS.LIST": {},
                                "ACCOUNTAUDITENTRIES.LIST": {},
                                "AUDITENTRIES.LIST": {},
                                "BRSIMPORTEDINFO.LIST": {},
                                "AUTOBRSCONFIGS.LIST": {},
                                "BANKURENTRIES.LIST": {},
                                "DEFAULTCHEQUEDETAILS.LIST": {},
                                "DEFAULTOPENINGCHEQUEDETAILS.LIST": {},
                                "CANCELLEDPAYALLOCATIONS.LIST": {},
                                "ECHEQUEPRINTLOCATION.LIST": {},
                                "ECHEQUEPAYABLELOCATION.LIST": {},
                                "EDDPRINTLOCATION.LIST": {},
                                "EDDPAYABLELOCATION.LIST": {},
                                "AVAILABLETRANSACTIONTYPES.LIST": {},
                                "LEDPAYINSCONFIGS.LIST": {},
                                "TYPECODEDETAILS.LIST": {},
                                "FIELDVALIDATIONDETAILS.LIST": {},
                                "INPUTCRALLOCS.LIST": {},
                                "GSTCLASSFNIGSTRATES.LIST": {},
                                "EXTARIFFDUTYHEADDETAILS.LIST": {},
                                "VOUCHERTYPEPRODUCTCODES.LIST": {}
                            }
                        }
                    }
                }
            }
        }
    };

// console.log(js2xmlparser.parse("person", obj));
 
// fs.writeFileSync('result.xml' , js2xmlparser.parse("person", obj) )
var jsonxml = require('jsontoxml');
 
var xml = jsonxml(obj)
fs.writeFileSync('result.xml' , xml )
// console.log(xml);