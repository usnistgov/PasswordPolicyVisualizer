#!/usr/bin/env python3
"""
Module contains BNFdfWithMeatadata and BNFdfWithoutMeatadata objects.
These objects break apart policies into CSVs, capturing key features, important
for further analysis, and variables neccessary for generating visualizations
with our HTML tool.

Inputs for both constructors are the location of directories that contain at
least one policy file, translated into the formal language.
"""

import sys
import os
import re
import pandas
import numpy
import TreeStructureHash

__author__ = "Elijah Peake"
__email__ = "elijah.peake@gmail.com"

# This may by subject to change.  Replaces variables when no input variables are present.
USER_INPUT_WARNING = "DEPENDS ON USER INPUT"

class BNFdfWithMeatadata:
    """
    Converts BNF "completed" files and metadata .txt file into a df that can be exported as a csv.

    "completed" files must NOT have a .txt extension and metadata must be input for each "completed" file in
    alphabetical order of policyID.
    """

    def __init__(self, files_location=""):
        """
        Constructor for out BNFdf.  May be empty, but directory of BNF files to be analyzed should be provided
        :param files_location: File path of our directory.  Should be unzipped.
        """
        self.files_location = files_location
        self.verb = []
        self.child0 = []
        self.child1 = []
        self.child2 = []
        self.child3 = []
        self.child4 = []
        self.child5 = []
        self.PolicyId = []
        self.Sector = []
        self.Audience = []
        self.BNF = []
        self.BNF_Base = []
        self.BNF_var1 = []
        self.BNF_var1_units = []
        self.BNF_var2 = []
        self.BNF_var2_units = []
        self.Grammar = []
        self.VerbCategory = []
        self.charset = []
        self.spec_char = []
        self._find_values_for_BNFdf()
        self.df = self._fill_BNFdf()

    def _files_in_directory(self, files_location):
        """
        File must be unzipped.  Searches files in a directory given by files_location.


        :param files_location: String.  Directory path.
        :return: Tupple.  Meta and completed file names.
        """
        file_names = os.listdir(files_location)

        completed_files = []
        for name in file_names:
            if name.endswith(".txt"):
                metadata = name
            else:
                completed_files.append(name)
        completed_files.sort()

        return metadata, completed_files

    def _import_completed_files(self, file_location, completed_files):
        """
        Imports our completed files once we know their locations.

        :param file_location:  String.  Directory path.
        :param completed_files:  List of "completed" file names
        :return: List of strings.  Our "completed" files.
        """
        completed_files_imported = []

        for i in range(0, len(completed_files)):
            completed_files_imported.append(open(file_location + "\\" + completed_files[i]).read())

        return completed_files_imported

    def _import_metadata(self, file_location, metadata):
        """
        Imports our completed files once we know their locations.

        :param file_location:  String.  Directory path.
        :param metadata:  List of "metadata" file name
        :return: String.  Our "metadata" file.
        """

        return (open(file_location + "\\" + metadata).read())

    def _get_completed_policies(self, completed_file_imported):
        """
        Get BNF rules from a "completed" file.

        :param completed_files_imported: List of strings.  Our "completed" files.
        :return: List of strings.  Our BNF rules.
        """

        completed_file_imported = re.sub("#\s+.*", "", completed_file_imported)   # Get rid of all the comments
        completed_file_imported = re.sub("\\n{2}", "", completed_file_imported)     # get rid of all extra lines breaks
        policies = completed_file_imported.split(".\n")   # because our rules all end with a period

        policies[0] = re.sub("\\nUsers", "Users", policies[0])     # need to get rid of the extra line break
        del policies[len(policies)-1]  # last element is an empty string so we remove it

        return policies

    def _get_metadata(self, metadata_imported):
        """
        Cleans metadata.

        :param metadata_imported:  String.  Our "metadata" file.
        :return:  List of strings.  Meatadata for each company's policies.
        """

        metadata_imported = re.sub("#.*", "", metadata_imported)   # Get rid of all the comments
        metadata_imported = re.sub("\\n{2}", "", metadata_imported)     # get rid of all extra new lines breaks
        meta_cleaned = metadata_imported.split("\n")   # split on new line

        del meta_cleaned[len(meta_cleaned)-1]  # last element is an empty string so we remove it

        return meta_cleaned

    def _get_policyids(self, meta_cleaned):
        """
        Get policyids from our metadata.

        :param meata_cleaned:  List of strings.  Meatadata for each company's policies.
        :return:  List of strings.  Our policyids.
        """
        policyids = []
        for i in range(0, len(meta_cleaned)):
            split_meta = re.split("<policyId>(.*)</policyId>", meta_cleaned[i])
            policyids.append(split_meta[1])  # our second element is the policyID

        return policyids

    def _get_sectors(self, meta_cleaned):
        """
        Get sectors from our metadata.

        :param meata_cleaned:  List of strings.  Meatadata for each company's policies.
        :return:  List of strings.  Our sectors.
        """
        sectors = []
        for i in range(0, len(meta_cleaned)):
            split_meta = re.split("<sector>(.*)</sector>", meta_cleaned[i])
            sectors.append(split_meta[1])  # our second element is the policyID

        return sectors

    def _get_audience(self, meta_cleaned):
        """
        Get audiences from our metadata.

        :param meata_cleaned:  List of strings.  Meatadata for each company's policies.
        :return:  List of strings.  Our audiences.
        """
        audiences = []
        for i in range(0, len(meta_cleaned)):
            split_meta = re.split("<audience>(.*)</audience>", meta_cleaned[i])
            audiences.append(split_meta[1])  # our second element is the policyID

        return audiences

    def _get_charset(self):
        """
        Get our char set from our BNF rules.

        :return: VOID
        """
        charsets = []
        for rule in self.BNF:
            char_match1 = re.findall("(?<=character in the set of )(.*)", rule)
            char_match2 = re.findall("(?<=characters in the set of )(.*)", rule)
            char_match3 = re.findall("(?<=sets: )(.*)", rule)

            if len(char_match1) > 0:     # in this case we have chars
                charsets.append(char_match1[0])

            elif len(char_match2) > 0:
                charsets.append(char_match2[0])

            elif len(char_match3) > 0:
                charsets.append(char_match3[0])

            else:     # no chars
                charsets.append("")

        self.charset = charsets

    def _get_specials(self):
        """
        Get our special char set from our BNF rules.

        :return: VOID
        """
        spchars = []

        for rule in self.charset:
            sp_char_match = re.findall("(?<=these special characters: )(.*)", rule)

            if len(sp_char_match) > 0:     # in this case we have special chars
                spchars.append(sp_char_match[0])     # our special chars

            else:     # no chars
                spchars.append("")

        # not the most efficient way to do this, but put unspec for special chars in spechars list
        for i in range(0, len(self.charset)):
            if len(re.findall("special characters \(unspec\)", self.charset[i])) > 0:     # if we have a match
                spchars[i] = "(unspec)"

        self.spec_char = spchars

    def _get_verbs(self):
        """
        Get verbs from out BNF rules.

        :return: VOID
        """
        verbs = []
        for rule in self.BNF:
            if len(re.findall("must not", rule)) > 0:    # we do the "not" case first so that must is a diff mapping
                verbs.append("prohibited")
            elif len(re.findall("must", rule)) > 0:
                verbs.append("required")
            elif len(re.findall("should not", rule)) > 0:
                verbs.append("dissuaded")
            else:   # should
                verbs.append("recommended")

        self.VerbCategory = verbs

    def _get_grammar(self):
        """
        Get grammars from our BNF rules.

        :return: VOID
        """
        grammars = []
        for rule in self.BNF:
            if len(re.findall("create passwords", rule)) > 0:
                grammars.append("create")
            elif len(re.findall("change passwords", rule)) > 0:
                grammars.append("change")
            elif len(re.findall("communicate passwords", rule)) > 0:
                grammars.append("communicate")
            elif len(re.findall("store passwords", rule)) > 0:
                grammars.append("store")
            else:   # lockout
                grammars.append("fail to authenticate")

        self.Grammar = grammars

    def _get_v1_v1unit_v2_v2unit(self):
        """
        Gets Variable 1, variable 1 units, variable 2, and variable 2 units from BNF questions.

        :return: Tupple of all the above in that order.
        """
        v1s = []
        v1_units = []
        v2s = []
        v2_units = []

        for rule in self.BNF:
            nums = re.findall(r"[0-9]+|" + re.escape(USER_INPUT_WARNING), rule)
            if len(nums) == 0:    # we've got nothing
                v1s.append("")
                v2s.append("")
            elif len(nums) == 1:
                v1s.append(nums[0])
                v2s.append("")
            else:   # len(nums) == 2
                v1s.append(nums[0])
                v2s.append(nums[1])

        for i in range(0, len(self.BNF)):
            post_number = re.split(r"[0-9]+|" + re.escape(USER_INPUT_WARNING), self.BNF[i])

            if len(post_number) == 1:    # we've got nothing
                v1_units.append("")
                v2_units.append("")

            elif len(post_number) == 2:  #
                pre_unit1 = post_number[1].split()
                index = 0
                while pre_unit1[index] in ["or", "more"]:   # keep moving along the sentence until not in this set
                    index += 1

                var_l = pre_unit1[index]
                if var_l == "consecutive":
                    v1_units.append("consecutive characters")
                elif var_l == "unique":
                    v1_units.append("unique characters")
                else:
                    v1_units.append(var_l)

                v2_units.append("")   # no units exist, but need to equal length

            else:    # len(post_number) == 3
                pre_unit1 = post_number[1].split()
                pre_unit2 = post_number[2].split()

                var_l = pre_unit1[0]
                if var_l == "of":
                    v1_units.append("sets")
                else:
                    v1_units.append(var_l)

                v2_units.append(re.sub(":", "", pre_unit2[0]))

        return v1s, v1_units, v2s, v2_units

    def _get_base(self):
        """
        Gets the BNF base from BNF questions.

        :return: VOID
        """
        bases = []

        splits = []
        for rule in self.BNF:
            splits.append(re.findall("character[s\s]+in the set of", rule))

        seperated_BNFs = []
        for rule in self.BNF:
            seperated_BNFs.append(re.split("character[s\s]+in the set of", rule))

        for i in range(0, len(seperated_BNFs)):
            if len(seperated_BNFs[i]) > 1:
                bases.append(seperated_BNFs[i][0] + splits[i][0] + " /char set/")
            else:
                bases.append(seperated_BNFs[i][0])

        # repeat for the "sets:" possibility
        splits = []
        for rule in bases:
            splits.append(re.findall("sets: ", rule))

        seperated_BNFs = []
        for rule in bases:
            seperated_BNFs.append(re.split("sets:", rule))

        for i in range(0, len(seperated_BNFs)):
            if len(seperated_BNFs[i]) > 1:
                bases[i] = seperated_BNFs[i][0] + splits[i][0] + " /char set/"
            else:
                bases[i] = seperated_BNFs[i][0]

        # getting rid of numbers
        for i in range(0, len(bases)):
            rule = re.sub("[0-9]+ times in a [0-9]+ (.+) interval", "/number/ times in a /number/ /time unit/ interval", bases[i])
            rule = re.sub("[0-9]+ times", "/number/ times", rule)
            rule = re.sub("[0-9]+ (.+) lockout", "/number/ /time unit/ lockout", rule)

            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*times in a " + re.escape(USER_INPUT_WARNING) + "(\s)*(.+) interval", "/number/ times in a /number/ /time unit/ interval", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*times", "/number/ times", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*lockout", "/number/ /time unit/ lockout", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING), "/number/", rule)

            rule = re.sub("[0-9]+", "/number/", rule)
            bases[i] = rule

        self.BNF_Base = bases

    def _find_values_for_BNFdf(self):
        """
        Updates all the data fields using the above functions.

        :return: VOID
        """

        _files_in_directory = self._files_in_directory(self.files_location)
        completed_files = self._import_completed_files(self.files_location, _files_in_directory[1])
        imported_metadata = self._import_metadata(self.files_location, _files_in_directory[0])
        clean_metadata = self._get_metadata(imported_metadata)

        # Taking care of our BNFs and metadata first
        listed_BNFs = []
        for file in completed_files:
            listed_BNFs.append(self._get_completed_policies(file))

        # number of times we need to rep metadata
        reps = []
        for element in listed_BNFs:
            reps.append(len(element))
        self.BNF = sum(listed_BNFs, [])

        policyids = self._get_policyids(clean_metadata)
        for i in range(0, len(reps)):
            self.PolicyId.extend(numpy.repeat(policyids[i], reps[i]))

        sectors = self._get_sectors(clean_metadata)
        for i in range(0, len(reps)):
            self.Sector.extend(numpy.repeat(sectors[i], reps[i]))

        audiences = self._get_audience(clean_metadata)
        for i in range(0, len(reps)):
            self.Audience.extend(numpy.repeat(audiences[i], reps[i]))

        self._get_charset()
        self._get_specials()
        self._get_verbs()
        self._get_grammar()
        self._get_base()

        lots_o_stuff = self._get_v1_v1unit_v2_v2unit()
        self.BNF_var1 = lots_o_stuff[0]
        self.BNF_var1_units = lots_o_stuff[1]
        self.BNF_var2 = lots_o_stuff[2]
        self.BNF_var2_units = lots_o_stuff[3]

        # see documentation of TreeStructureHash.py to see why we print
        hash_table = TreeStructureHash.HashTable()
        for i, rule in enumerate(self.BNF_Base):
            print(i, rule)
            verb_and_children = hash_table.get_verb_and_children(rule)

            self.verb.append(verb_and_children[0])
            self.child0.append(verb_and_children[1])
            self.child1.append(verb_and_children[2])
            self.child2.append(verb_and_children[3])
            self.child3.append(verb_and_children[4])
            self.child4.append(verb_and_children[5])
            self.child5.append(verb_and_children[6])


        # she wanted the periods still at the end of the BNFs
        for i in range(0, len(self.BNF)):
            self.BNF[i] = self.BNF[i] + "."

    def _fill_BNFdf(self):
        """
        Creates a df and fills it with our data fields.

        :return: Our filled df
        """
        df = pandas.DataFrame()

        df["verb"] = self.verb
        df["child0"] = self.child0
        df["child1"] = self.child1
        df["child2"] = self.child2
        df["child3"] = self.child3
        df["child4"] = self.child4
        df["child5"] = self.child5
        df["PolicyId"] = self.PolicyId
        df["Sector"] = self.Sector
        df["Audience"] = self.Audience
        df["BNF"] = self.BNF
        df["BNF Base"] = self.BNF_Base
        df["BNF var1"] = self.BNF_var1
        df["BNF var1 Unit"] = self.BNF_var1_units
        df["BNF var2"] = self.BNF_var2
        df["BNF var2 Unit"] = self.BNF_var2_units
        df["verb category"] = self.VerbCategory
        df["Grammar"] = self.Grammar
        df["charset"] = self.charset
        df["spec char"] = self.spec_char

        return df

    def export_BNFdf(self, directory, name):
        """
        Exports our df to a csv at a desired location with a desired name.

        :param directory:  File path of our desired file output location
        :param name:  Desired name of our file
        :return: VOID
        """
        self.df.to_csv(directory + "\\" + name + ".csv", sep=",", index=False)


class BNFdfWithoutMeatadata:
    """
    Converts BNF "completed" files into a df that can be exported as a csv.

    """

    def __init__(self, files_location=""):
        """
        Constructor for our BNFdf.  May be empty, but directory of BNF files to be analyzed should be provided
        :param files_location: File path of our directory.  Should be unzipped.
        """
        self.files_location = files_location
        self.verb = []
        self.child0 = []
        self.child1 = []
        self.child2 = []
        self.child3 = []
        self.child4 = []
        self.child5 = []
        self.file_names = []
        self.BNF = []
        self.BNF_Base = []
        self.BNF_var1 = []
        self.BNF_var1_units = []
        self.BNF_var2 = []
        self.BNF_var2_units = []
        self.Grammar = []
        self.VerbCategory = []
        self.charset = []
        self.spec_char = []
        self._find_values_for_BNFdf()
        self.df = self._fill_BNFdf()

    def _files_in_directory(self, files_location):
        """
        File must be unzipped.  Searches files in a directory given by files_location.


        :param files_location: String.  Directory path.
        :return: List. Completed file names.
        """
        file_names = os.listdir(files_location)

        completed_files = []
        for name in file_names:
            completed_files.append(name)
        completed_files.sort()

        return completed_files

    def _import_completed_files(self, file_location, completed_files):
        """
        Imports our completed files once we know their locations.

        :param file_location:  String.  Directory path.
        :param completed_files:  List of "completed" file names
        :return: List of strings.  Our "completed" files.
        """
        completed_files_imported = []

        for i in range(0, len(completed_files)):
            completed_files_imported.append(open(file_location + "\\" + completed_files[i]).read())

        return completed_files_imported

    def _get_completed_policies(self, completed_file_imported):
        """
        Get BNF rules from a "completed" file.

        :param completed_files_imported: List of strings.  Our "completed" files.
        :return: List of strings.  Our BNF rules.
        """

        completed_file_imported = re.sub("#\s+.*", "", completed_file_imported)   # Get rid of all the comments
        completed_file_imported = re.sub("\\n{2}", "", completed_file_imported)     # get rid of all extra lines breaks
        policies = completed_file_imported.split(".\n")   # because our rules all end with a period

        policies[0] = re.sub("\\nUsers", "Users", policies[0])     # need to get rid of the extra line break
        del policies[len(policies)-1]  # last element is an empty string so we remove it

        return policies

    def _get_charset(self):
        """
        Get our char set from our BNF rules.

        :return: VOID
        """
        charsets = []
        for rule in self.BNF:
            char_match1 = re.findall("(?<=character in the set of )(.*)", rule)
            char_match2 = re.findall("(?<=characters in the set of )(.*)", rule)
            char_match3 = re.findall("(?<=sets: )(.*)", rule)

            if len(char_match1) > 0:     # in this case we have chars
                charsets.append(char_match1[0])

            elif len(char_match2) > 0:
                charsets.append(char_match2[0])

            elif len(char_match3) > 0:
                charsets.append(char_match3[0])

            else:     # no chars
                charsets.append("")

        self.charset = charsets

    def _get_specials(self):
        """
        Get our special char set from our BNF rules.

        :return: VOID
        """
        spchars = []

        for rule in self.charset:
            sp_char_match = re.findall("(?<=these special characters: )(.*)", rule)

            if len(sp_char_match) > 0:     # in this case we have special chars
                spchars.append(sp_char_match[0])     # our special chars

            else:     # no chars
                spchars.append("")

        # not the most efficient way to do this, but put unspec for special chars in spechars list
        for i in range(0, len(self.charset)):
            if len(re.findall("special characters \(unspec\)", self.charset[i])) > 0:     # if we have a match
                spchars[i] = "(unspec)"

        self.spec_char = spchars

    def _get_verbs(self):
        """
        Get verbs from out BNF rules.

        :return: VOID
        """
        verbs = []
        for rule in self.BNF:
            if len(re.findall("must not", rule)) > 0:    # we do the "not" case first so that must is a diff mapping
                verbs.append("prohibited")
            elif len(re.findall("must", rule)) > 0:
                verbs.append("required")
            elif len(re.findall("should not", rule)) > 0:
                verbs.append("dissuaded")
            else:   # should
                verbs.append("recommended")

        self.VerbCategory = verbs

    def _get_grammar(self):
        """
        Get grammars from our BNF rules.

        :return: VOID
        """
        grammars = []
        for rule in self.BNF:
            if len(re.findall("create passwords", rule)) > 0:
                grammars.append("create")
            elif len(re.findall("change passwords", rule)) > 0:
                grammars.append("change")
            elif len(re.findall("communicate passwords", rule)) > 0:
                grammars.append("communicate")
            elif len(re.findall("store passwords", rule)) > 0:
                grammars.append("store")
            else:   # lockout
                grammars.append("fail to authenticate")

        self.Grammar = grammars

    def _get_v1_v1unit_v2_v2unit(self):
        """
        Gets Variable 1, variable 1 units, variable 2, and variable 2 units from BNF questions.

        :return: Tupple of all the above in that order.
        """
        v1s = []
        v1_units = []
        v2s = []
        v2_units = []

        for rule in self.BNF:
            nums = re.findall(r"[0-9]+|" + re.escape(USER_INPUT_WARNING), rule)
            if len(nums) == 0:    # we've got nothing
                v1s.append("")
                v2s.append("")
            elif len(nums) == 1:
                v1s.append(nums[0])
                v2s.append("")
            else:   # len(nums) == 2
                v1s.append(nums[0])
                v2s.append(nums[1])

        for i in range(0, len(self.BNF)):
            post_number = re.split(r"[0-9]+|" + re.escape(USER_INPUT_WARNING), self.BNF[i])

            if len(post_number) == 1:    # we've got nothing
                v1_units.append("")
                v2_units.append("")

            elif len(post_number) == 2:  #
                pre_unit1 = post_number[1].split()
                index = 0
                while pre_unit1[index] in ["or", "more"]:   # keep moving along the sentence until not in this set
                    index += 1

                var_l = pre_unit1[index]
                if var_l == "consecutive":
                    v1_units.append("consecutive characters")
                elif var_l == "unique":
                    v1_units.append("unique characters")
                else:
                    v1_units.append(var_l)

                v2_units.append("")   # no units exist, but need to equal length

            else:    # len(post_number) == 3
                pre_unit1 = post_number[1].split()
                pre_unit2 = post_number[2].split()

                var_l = pre_unit1[0]
                if var_l == "of":
                    v1_units.append("sets")
                else:
                    v1_units.append(var_l)

                v2_units.append(re.sub(":", "", pre_unit2[0]))

        return v1s, v1_units, v2s, v2_units

    def _get_base(self):
        """
        Gets the BNF base from BNF questions.

        :return: VOID
        """
        bases = []

        splits = []
        for rule in self.BNF:
            splits.append(re.findall("character[s\s]+in the set of", rule))

        seperated_BNFs = []
        for rule in self.BNF:
            seperated_BNFs.append(re.split("character[s\s]+in the set of", rule))

        for i in range(0, len(seperated_BNFs)):
            if len(seperated_BNFs[i]) > 1:
                bases.append(seperated_BNFs[i][0] + splits[i][0] + " /char set/")
            else:
                bases.append(seperated_BNFs[i][0])

        # repeat for the "sets:" possibility
        splits = []
        for rule in bases:
            splits.append(re.findall("sets: ", rule))

        seperated_BNFs = []
        for rule in bases:
            seperated_BNFs.append(re.split("sets:", rule))

        for i in range(0, len(seperated_BNFs)):
            if len(seperated_BNFs[i]) > 1:
                bases[i] = seperated_BNFs[i][0] + splits[i][0] + " /char set/"
            else:
                bases[i] = seperated_BNFs[i][0]

        # getting rid of numbers
        for i in range(0, len(bases)):
            rule = re.sub("[0-9]+ times in a [0-9]+ (.+) interval", "/number/ times in a /number/ /time unit/ interval", bases[i])
            rule = re.sub("[0-9]+ times", "/number/ times", rule)
            rule = re.sub("[0-9]+ (.+) lockout", "/number/ /time unit/ lockout", rule)

            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*times in a " + re.escape(USER_INPUT_WARNING) + "(\s)*(.+) interval", "/number/ times in a /number/ /time unit/ interval", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*times", "/number/ times", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING) + "(\s)*lockout", "/number/ /time unit/ lockout", rule)
            rule = re.sub(re.escape(USER_INPUT_WARNING), "/number/", rule)

            rule = re.sub("[0-9]+", "/number/", rule)
            bases[i] = rule

        self.BNF_Base = bases

    def _find_values_for_BNFdf(self):
        """
        Updates all the data fields using the above functions.

        :return: VOID
        """

        _files_in_directory = self._files_in_directory(self.files_location)
        completed_files = self._import_completed_files(self.files_location, _files_in_directory)

        # Taking care of our BNFs and metadata first
        listed_BNFs = []
        for file in completed_files:
            listed_BNFs.append(self._get_completed_policies(file))

        # number of times we need to rep metadata
        reps = []
        for element in listed_BNFs:
            reps.append(len(element))

        self.BNF = sum(listed_BNFs, [])

        for i in range(0, len(reps)):
            self.file_names.extend(numpy.repeat(_files_in_directory[i], reps[i]))

        self._get_charset()
        self._get_specials()
        self._get_verbs()
        self._get_grammar()
        self._get_base()

        lots_o_stuff = self._get_v1_v1unit_v2_v2unit()
        self.BNF_var1 = lots_o_stuff[0]
        self.BNF_var1_units = lots_o_stuff[1]
        self.BNF_var2 = lots_o_stuff[2]
        self.BNF_var2_units = lots_o_stuff[3]

        # see documentation of TreeStructureHash.py to see why we print
        hash_table = TreeStructureHash.HashTable()
        for i, rule in enumerate(self.BNF_Base):
            print(i, rule)
            verb_and_children = hash_table.get_verb_and_children(rule)

            self.verb.append(verb_and_children[0])
            self.child0.append(verb_and_children[1])
            self.child1.append(verb_and_children[2])
            self.child2.append(verb_and_children[3])
            self.child3.append(verb_and_children[4])
            self.child4.append(verb_and_children[5])
            self.child5.append(verb_and_children[6])

        # she wanted the periods still at the end of the BNFs
        for i in range(0, len(self.BNF)):
            self.BNF[i] = self.BNF[i] + "."

    def _fill_BNFdf(self):
        """
        Creates a df and fills it with our data fields.

        :return: Our filled df
        """
        df = pandas.DataFrame()

        df["verb"] = self.verb
        df["child0"] = self.child0
        df["child1"] = self.child1
        df["child2"] = self.child2
        df["child3"] = self.child3
        df["child4"] = self.child4
        df["child5"] = self.child5
        df["File Name"] = self.file_names
        df["BNF"] = self.BNF
        df["BNF Base"] = self.BNF_Base
        df["BNF var1"] = self.BNF_var1
        df["BNF var1 Unit"] = self.BNF_var1_units
        df["BNF var2"] = self.BNF_var2
        df["BNF var2 Unit"] = self.BNF_var2_units
        df["verb category"] = self.VerbCategory
        df["Grammar"] = self.Grammar
        df["charset"] = self.charset
        df["spec char"] = self.spec_char

        return df

    def export_BNFdf(self, directory, name):
        """
        Exports our df to a csv at a desired location with a desired name.

        :param directory:  File path of our desired file output location
        :param name:  Desired name of our file
        :return: VOID
        """
        self.df.to_csv(directory + "\\" + name + ".csv", sep=",", index=False)


def print_usage():
    """
    Prints the correct usage of the program

    :return: VOID
    """
    print("--------------------------------------------------------------------------------------------------------")
    print("\nCHECK TO MAKE SURE DIRECTORY PATH IS ONE WORD\n")
    print("\nUsage: python3 PolicyToCSV.py <infolder_path> <outfile_directory_path> <outfile_desired_name")
    print("\nExample: ")
    print("\\Users\\ebp\\PycharmProjects\\Passwords\\venv\Scripts\\python.exe "
          "C:\\Users\\ebp\\PycharmProjects\\Passwords\\PolicyToCSV.py "
          "C:\\Users\\ebp\\Desktop\\my_directory C:\\Users\\ebp\\Desktop\\my_desired_output location my_output")
    print("--------------------------------------------------------------------------------------------------------")


if __name__ == "__main__":
    if len(sys.argv) == 4:
        try:
            BNF_df = BNFdfWithMeatadata(sys.argv[1])
            BNF_df.BNF_Base[0] # (did it work)
            BNF_df.export_BNFdf(sys.argv[2], sys.argv[3])
            print("\nFile Successfully Exported with metadata.")

        except (IndexError, UnboundLocalError) as e:
            print("\nMetadata incorrectly formatted.  A data frame without metadata will be generated.")

        if "BNF_df" not in locals():
            BNF_df = BNFdfWithoutMeatadata(sys.argv[1])
            BNF_df.export_BNFdf(sys.argv[2], sys.argv[3])
            print("File Successfully Exported without metadata.")
    else:
        print_usage()
