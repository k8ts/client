#!/bin/bash

wget -q -O apis/1.7.json https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.7/api/openapi-spec/swagger.json
wget -q -O apis/1.8.json https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.8/api/openapi-spec/swagger.json
wget -q -O apis/1.9.json https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.9/api/openapi-spec/swagger.json
wget -q -O apis/1.10.json https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.10/api/openapi-spec/swagger.json
