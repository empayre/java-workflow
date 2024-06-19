import json
# Load the JSON file
with open('semgrep.json') as f:
    data = json.load(f)

# Extract the required fields
extracted_data = []
for result in data.get('results', []):
    path = result.get('path')
    start = result.get('start')
    end = result.get('end')
    severity = result.get('extra', {}).get('severity')
    extracted_data.append({
        'path': path,
        'start': start,
        'end': end,
        'severity': severity
    })

# Print the extracted data
#for item in extracted_data:
#    print(item)
