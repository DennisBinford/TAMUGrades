def get_mongodb_collection(database_name, collection_name, client_uri):
    from pymongo.mongo_client import MongoClient
    if (not isinstance(database_name, str)):
        raise TypeError("Database name must be given as a string!")
    if (not isinstance(collection_name, str)):
        raise TypeError(
            "Collection name must be given as a string!")
    try:
        client = MongoClient(client_uri)
    except Exception as e:
        print(e)
    database = client[database_name]
    collection = database[collection_name]
    return collection
