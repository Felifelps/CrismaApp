DATE_PATTERN = '%Y-%m-%d'

def check_data_fields(request, fields):
    data = request.get_json()
    for field in fields:
        if data.get(field) is None:
            return False, field
    return True, data