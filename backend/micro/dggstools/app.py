from flask import Flask, request, jsonify
from lib.common import AUIDGenerator

app = Flask(__name__)
AUIDGenerator = AUIDGenerator()




@app.route('/api/dggstools/generate-auid-hash', methods=['get'])
def generateAuidHash():
    data = request.get_json()
    cuids = data['cuids']

    auid_comp_b64, hashed_b64 = AUIDGenerator.generate_auid_hash_b64(cuids)
    return jsonify({'auid_comp_b64': auid_comp_b64, 'hashed_b64': hashed_b64})


@app.route('/api/dggstools/cuids-from-auid', methods=['get'])
def getCuidsFromAuid():
    data = request.get_json()
    auid = data['auid']

    cuids = AUIDGenerator.cuids_from_auid_b64(auid)
    return jsonify({'cuids': cuids})


@app.route('/api/dggstools/hash', methods=['get'])
def hash():
    data = request.get_json()
    auid = data['auid']

    hashed = AUIDGenerator.hash_b64_from_auid(auid)
    return jsonify({'hashed': hashed})


if __name__ == '__main__':
    app.run(debug=True)
