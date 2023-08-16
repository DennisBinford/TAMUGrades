This is the API code

TODOs:
Find a way to modulate the code that is being reused through importing functions
Ex:
        if (total === 0) {
            res.status(404).json({error: true, message: "No Section Found"})
        }
        else if ((total - (page+1) * limit) <= 0) {
            res.status(404).json({error: true, message: "Page Out of Bounds"})
        }
        else {
            res.status(200).json(response)
        }


BUGs: