# Generating CSV files from our translated policy files and .txt metadata

Contains the code necessary to take directories filled with policy files translated into [the formal password language](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) and create CSV input files for our visualization tool.  CSV files also contain several variables important to researchers and possibly policy makers.  These variables include the following: File Name,	BNF (our rule),	BNF Base (our rule without variables),	BNF var1,	BNF var1 Unit,	BNF var2,	BNF var2 Unit,	verb category,	Grammar (rule category, i.e. create, store, etc.),	charset,	spec char (special character set).  Several test directories are included to demonstrate proper formatting of policy and metadata files.

---
## FILES IN DIRECTORY MUST:
1) have "file" extension (not .txt)
2) on each line (\n), contain a separate policy rule, translated into [the formal password language previously developed at NIST](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) and possibly comments, signified by a pound sign at the beginning of the line (#).

## IF YOU HAVE METADATA IN YOUR DIRECTORY, IT MUST:
1) be a .txt file
2) indicate filename, policyID, sector, and audience in XML format
3) be the only metadata file in the directory
4) have a row for each file in the directory
5) be in alphabetical order of policyID.

## ISSUES:
Rules that are not translated perfectly into the formal language will cause
errors. When rules are not properly translated, our BNF bases generated in
PolicyToCSV.py are incorrectly formatted, which means that our TreeStructureHash.py
is unable to get the proper variables, and thus an error will be thrown.
To help identify our misformatted rule, from our PolicyToCSV.py file and TreeStructureHash.py file,
we print each of our bases before and while they are being searched in the hash table.
This way, we can see the last rule that was searched for before an error was thrown.

## TO CORRECT AN ERROR:
1) fix the hash table (both keys and values)
2) fix the treeDataStructure.csv file so that our children values from the hash
table exactly match the children in the csv file.

NOTE: USER_INPUT_WARNING is the output of our online system at NIST for
translating policies into the formal language when variables are not provided.
This my change if the online system changes.

## TO ADD RULES TO THE BNF:
1) you must edit the entire PolicyToCSV.py file to make sure that rule
features are being binned into the correct csv columns.
2) you must add keys and values to the TreeStructureHash.py file
3) you must add corresponding children to the csv file. **PLEASE NOTE:** all
children pairs must be unique or files will not be correctly highlighted in the
tree visualization. Note how there are spaces currently present in the csv file
to mitigate this issue.

## Additional information
No current installation instructions

## Developer Contact Information
 - Elijah Peake - <elijah.peake@gmail.com>
