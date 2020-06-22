
let NODE_ENV = process.env.NODE_ENV || 'development';
let ENV_OBJ ;
switch (NODE_ENV) {
    case 'development':
        ENV_OBJ = {PORT: 4000,
        DEV_POSTGRES_URL: "postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761",
        FTP_USER: 'clubmarriot',
        FTP_HOST: '52.20.202.8',
        FTP_PASSWORD: 'DF3tfr#RRdftt4',
        }
        break;
    case 'microtest':
        ENV_OBJ = {PORT: 5000,
        DEV_POSTGRES_URL: "postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761",
        FTP_USER: 'clubmarriot',
        FTP_HOST: '52.20.202.8',
        FTP_PASSWORD: 'DF3tfr#RRdftt4',
        }
        break;
    case 'production':
        ENV_OBJ = {PORT: 6000,
        DEV_POSTGRES_URL: "postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761",
        FTP_USER: 'clubmarriot',
        FTP_HOST: '52.20.202.8',
        FTP_PASSWORD: 'DF3tfr#RRdftt4',
        }
        break;
    default:
        ENV_OBJ = {PORT: 7000,
        DEV_POSTGRES_URL: "postgres://ubsdbg31f95i5j:p758910137107b433378cb9223269eb6f6198229d8598027cf27fe5914114442c@ec2-52-44-207-225.compute-1.amazonaws.com:5432/d3accf1c2cg761",
        FTP_USER: 'clubmarriot',
        FTP_HOST: '52.20.202.8',
        FTP_PASSWORD: 'DF3tfr#RRdftt4',
        }
        break;
}
module.exports={
    ENV_OBJ
}