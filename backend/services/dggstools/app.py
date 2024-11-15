from flask import Flask, request, jsonify
from flask_cors import CORS

from lib.common import AUIDGenerator
AUIDGenerator = AUIDGenerator()

app = Flask(__name__)
CORS(app)


@app.route('/api/dggstools/generate-auid-hash', methods=['get'])
def generateAuidHash():
    cuids_string = request.args.get('cuids', '')
    cuids = [s for s in cuids_string.split(',') if s]

    auid_comp_b64, hashed_b64 = AUIDGenerator.generate_auid_hash_b64(cuids)
    return jsonify({'auid_comp_b64': auid_comp_b64, 'hashed_b64': hashed_b64})


@app.route('/api/dggstools/cuids-from-auid', methods=['get'])
def getCuidsFromAuid():
    auid = request.args.get('auid')

    cuids = AUIDGenerator.cuids_from_auid_b64(auid)
    return jsonify({'cuids': cuids})


@app.route('/api/dggstools/hash', methods=['get'])
def hash():
    auid = request.args.get('auid')

    hashed = AUIDGenerator.hash_b64_from_auid(auid)
    return jsonify({'hashed_b64': hashed})

@app.route('/test', methods=['get'])
def test():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
