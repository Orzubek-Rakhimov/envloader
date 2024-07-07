import {EnvConfig, loadEnv , LoadEnvOptions} from '../src/index'

const config : LoadEnvOptions = {
    variables:{}
} 

const envVariables:EnvConfig = loadEnv('.env.test', config);

console.log(envVariables);