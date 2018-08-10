# Visualization Software for Analyzing Password Policies

The optimal intersection of security and policy usability remains unknown.
As a step to determine this intersection and help researchers more easily
explore password policies, we developed this interactive visualization
software with interface and technical domain requirements in mind. Key to our exploratory analysis, the tool
enables us to both visually and quantitatively explore the otherwise convoluted
language of password policies.  Policy makers may also find the visualization tool useful for creating future policies and exploring the development of their organization's policies over time.

---
## What is included
This project contains all the code necessary to visualize password policies translated into [the formal password language previously developed at NIST](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) through interactive visualization software. This project contains two separate directories, "Python Preprocessing Files" and "Visualization Tool".   

* "Python Preprocessing Files" contains the code necessary to take directories filled with policy files translated into [the formal password language](https://nvlpubs.nist.gov/nistpubs/ir/2013/NIST.IR.7970.pdf) and create CSV input files for our visualization tool.  CSV files also contain several variables important to researchers and possibly policy makers.  These variables include the following: File Name,	BNF (our rule),	BNF Base (our rule without variables),	BNF var1,	BNF var1 Unit,	BNF var2,	BNF var2 Unit,	verb category,	Grammar (rule category, i.e. create, store, etc.),	charset,	spec char (special character set).  Several test directories are included to demonstrate proper formatting of policy and metadata files.

* "Visualization Tool" contains the code required to run our interactive visualization tool.  The tool takes our CSV files generated using code in the "Python Preprocessing Files" directory as inputs.  Included in the "Visualization Tool" directory are example inputs, included in the "Test Files" directory.  These inputs were generated from our example directory files in our "Python Preprocessing Files" directory.

## Additional information
No current installation instructions

## Developer Contact Information
 - Elijah Peake - <elijah.peake@gmail.com>

## Project Contact Information
 - Michelle Steves - <michelle.steves@nist.gov>