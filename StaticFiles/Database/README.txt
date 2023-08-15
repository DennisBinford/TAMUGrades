There are three "professors" without the actual name, errors in the parsing of the pdfs that must be checked OUTLAW
There are 22 "professors" with the name "None" indicating that no name was provided (this is actually the case with some rare ones)
Need to manually double check all 22 of these to ensure that the None check is working correctly when it goes off
298 that do not have a space to check as well {professor : {$not : {$regex : " "}}} 
Need to random check this first to see if there is a pattern especially cuz Chamberland- implies there was something attached