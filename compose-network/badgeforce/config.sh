#!/bin/bash

KEY_DIR=${SAWTOOTH_HOME}/keys
DATA_DIR=${SAWTOOTH_HOME}/data
LOG_DIR=${SAWTOOTH_HOME}/logs
POLICY_DIR=${SAWTOOTH_HOME}/policy
CONFIG_PATH=${SAWTOOTH_HOME}/etc

mkdir -p ${KEY_DIR}
mkdir -p ${DATA_DIR}
mkdir -p ${LOG_DIR}
mkdir -p ${POLICY_DIR}
mkdir -p ${CONFIG_PATH}

# IF KEY ALREADY ON SERVER USE IT OR ELSE USE ONE PROVIDED ABOVE
if [ ! -e "$KEY_DIR/validator.priv" ]; then
    echo ${PRIVKEY} >> ${KEY_DIR}/validator.priv;
fi

if [ ! -e "$KEY_DIR/validator.pub" ]; then
  echo ${PUBKEY} >> ${KEY_DIR}/validator.pub;
fi

# IF VALIDATOR CONFIG EXISTS USE IT OR ELSE UPDATE IT WITH 0MQ NETWORK KEYS
if [ ! -e "$CONFIG_PATH/validator.toml" ]; then
  echo "network_private_key = '$NETWORKPRIVKEY'" >> ${CONFIG_PATH}/validator.toml;
  echo "network_public_key = '$NETWORKPUBKEY'" >> ${CONFIG_PATH}/validator.toml;
  echo "bind = ['$BIND_NETWORK', '$BIND_COMPONENT'"] >> ${CONFIG_PATH}/validator.toml;
  echo "endpoint = '$NETWORK_BROADCAST_ADDR'"] >> ${CONFIG_PATH}/validator.toml;
fi

# POET SGX SIMULATOR REGISTRATION
poet enclave basename --enclave-module simulator
poet registration create --enclave-module simulator
sawset genesis --key ${KEY_DIR}/validator.priv
#tcp://ec2-54-157-43-236.compute-1.amazonaws.com:8800

if [ ! -e "$DATA_DIR/block-chain-id" ]; then
    sawadm genesis
fi