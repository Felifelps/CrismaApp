def check_data_fields(request, fields):
    data = request.get_json()
    for field in fields:
        if not data.get(field):
            return False, field
    return True, data