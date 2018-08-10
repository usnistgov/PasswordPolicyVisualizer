#!/usr/bin/env python3
"""
Module contains a HashTable object, neccessary for getting the vairables
needed for our visualization tool from each of our base BNF rules.
"""

import re

__author__ = "Elijah Peake"
__email__ = "elijah.peake@gmail.com"

class HashTable:
    def __init__(self):
        self._hash_table = {'Users change passwords before /number/ days': ['Users', 'Change Passwords', 'Before /number/ days', '', '', ''],
                            'Users change passwords before /number/ days if compromised': ['Users', 'Change Passwords', 'Before /number/ days if', 'Compromised', '', ''],
                            'Users change passwords before /number/ days if directed by management': ['Users', 'Change Passwords', 'Before /number/ days if', 'Directed By Management', '', ''],
                            'Users change passwords before /number/ days if found non-compliant': ['Users', 'Change Passwords', 'Before /number/ days if', 'Found Non-Compliant', '', ''],
                            'Users change passwords before /number/ days if sent unencrypted': ['Users', 'Change Passwords', 'Before /number/ days if', 'Sent Unencrypted', '', ''],
                            'Users change passwords before /number/ days if shared': ['Users', 'Change Passwords', 'Before /number/ days if', 'Shared', '', ''],
                            'Users change passwords immediately if compromised': ['Users', 'Change Passwords', 'Immediately if', 'Compromised', '', ''],
                            'Users change passwords immediately if directed by management': ['Users', 'Change Passwords', 'Immediately if', 'Directed By Management', '', ''],
                            'Users change passwords immediately if found non-compliant': ['Users', 'Change Passwords', 'Immediately if', 'Found Non-Compliant', '', ''],
                            'Users change passwords immediately if sent unencrypted': ['Users', 'Change Passwords', 'Immediately if', 'Sent Unencrypted', '', ''],
                            'Users change passwords immediately if shared': ['Users', 'Change Passwords', 'Immediately if', 'Shared', '', ''],
                            'Users communicate passwords except in an emergency': ['Users', 'Communicate Passwords', 'Except in an emergency', '', '', ''],
                            'Users communicate passwords to a third party': ['Users', 'Communicate Passwords', 'To', 'A third Party', '', ''],
                            'Users communicate passwords to anyone': ['Users', 'Communicate Passwords', 'To', 'Anyone', '', ''],
                            'Users communicate passwords by any means': ['Users', 'Communicate Passwords', 'by', 'Any means', '', ''],
                            'Users communicate passwords by any network without encryption': ['Users', 'Communicate Passwords', 'by', 'Any Network without encryption', '', ''],
                            'Users communicate passwords by any network': ['Users', 'Communicate Passwords', 'by', 'Any network', '', ''],
                            'Users communicate passwords by email without encryption': ['Users', 'Communicate Passwords', 'by', 'Email without encryption', '', ''],
                            'Users communicate passwords by email': ['Users', 'Communicate Passwords', 'by', 'Email', '', ''],
                            'Users communicate passwords by mail without encryption': ['Users', 'Communicate Passwords', 'by', 'Mail without encryption', '', ''],
                            'Users communicate passwords by mail accompanied by the user ID': ['Users', 'Communicate Passwords', 'by', 'Mail accompanied by the user ID', '', ''],
                            'Users communicate passwords by mail': ['Users', 'Communicate Passwords', 'by', 'Mail', '', ''],
                            'Users communicate passwords by phone mail': ['Users', 'Communicate Passwords', 'by', 'Phone Mail', '', ''],
                            'Users communicate passwords by phone': ['Users', 'Communicate Passwords', 'by', 'Phone', '', ''],
                            'Users communicate passwords by Internet or wide-area network': ['Users', 'Communicate Passwords', 'by', 'Internet or wide-area network', '', ''],
                            'Users communicate passwords by Internet or wide-area network without encryption': ['Users', 'Communicate Passwords', 'by', 'Internet or wide-area network without encryption', '', ''],
                            'Users communicate passwords by local area network': ['Users', 'Communicate Passwords', 'by', 'Local area network', '', ''],
                            'Users communicate passwords by local area network without encryption': ['Users', 'Communicate Passwords', 'by', 'Local area network without encryption', '', ''],
                            'Users create passwords with length greater than or equal to /number/ characters': ['Users', 'Create Passwords', 'With length greater than or equal to /number/ characters', '', '', ''],
                            'Users create passwords with a character in the set of /char set/': ['Users', 'Create Passwords', 'With a character in the set of /char set/', '', '', ''],
                            'Users create passwords with all characters in the set of /char set/': ['Users','Create Passwords','With all characters in the set of /char set/','', '', ''],
                            'Users create passwords with a character in the first /number/ characters in the set of /char set/': ['Users', 'Create Passwords', 'With a character in the first /number/ characters in the set of /char set/', '', '', ''],
                            'Users create passwords with /number/ or more characters in the set of /char set/': ['Users', 'Create Passwords', 'With /number/ or more characters in the set of /char set/', '', '', ''],
                            'Users create passwords with an internal character in the set of /char set/': ['Users', 'Create Passwords', 'With an internal character in the set of /char set/', '', '', ''],
                            'Users create passwords with a first or last character in the set of /char set/': ['Users', 'Create Passwords', 'With a first or last character in the set of /char set/', '', '', ''],
                            'Users create passwords equal to the user ID': ['Users', 'Create Passwords', '\s', 'Equal to', 'The user ID', ''],
                            'Users create passwords equal to their name': ['Users', 'Create Passwords', '\s', 'Equal to', 'Their name', ''],
                            'Users create passwords in the set of dictionary words': ['Users', 'Create Passwords', '\s', 'In the set of', 'Dictionary Words', ''],
                            'Users create passwords in the set of dictionary words followed by a number': ['Users', 'Create Passwords', '\s', 'In the set of', 'Dictionary Words +', 'Followed by a number'],
                            'Users create passwords in the set of dictionary words in reverse': ['Users', 'Create Passwords', '\s', 'In the set of', 'Dictionary Words +', 'In reverse'],
                            'Users create passwords in the set of dictionary words with numbers substituted for letters': ['Users', 'Create Passwords', '\s', 'In the set of', 'Dictionary Words +', 'With numbers substituted for letters'],
                            'Users create passwords in the set of dictionary words preceded or followed by a number or special character (unspec)': ['Users', 'Create Passwords', '\s', 'In the set of', 'Dictionary Words +', 'Preceded or followed by a number or special character (unspec)'],
                            'Users create passwords in the set of otherwise forbidden content concatenated': ['Users', 'Create Passwords', '\s', 'In the set of', 'Otherwise forbidden content', 'Concatenated'],
                            'Users create passwords in the set of otherwise forbidden content in reverse': ['Users', 'Create Passwords', '\s', 'In the set of', 'Otherwise forbidden content', 'In reverse'],
                            'Users create passwords in the set of otherwise forbidden content preceded or followed by a number': ['Users', 'Create Passwords', '\s', 'In the set of', 'Otherwise forbidden content', 'Preceded or followed by a number'],
                            'Users create passwords in the set of their last /number/ passwords': ['Users', 'Create Passwords', '\s', 'In the set of', 'Their last', '/number/ passwords'],
                            'Users create passwords in the set of their last /number/ years of passwords': ['Users', 'Create Passwords', '\s', 'In the set of', 'Their last', '/number/ years of passwords'],
                            'Users create passwords in the set of strings with a character repeated /number/ or more times consecutively': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'A character repeated /number/ or more times consecutively'],
                            'Users create passwords in the set of strings with a character repeated /number/ or more times': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'A character repeated /number/ or more times'],
                            'Users create passwords in the set of strings with a run of /number/ or more consecutive characters in sequence': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'A run of /number/ or more consecutive characters in sequence'],
                            'Users create passwords in the set of strings with at least /number/ unique characters': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'At least /number/ unique characters'],
                            'Users create passwords in the set of strings with characters from /number/ of these /number/ sets:': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'Characters from /number/ of these /number/ sets:'],
                            'Users create passwords in the set of strings with word or number patterns (unspec)': ['Users', 'Create Passwords', '\s', 'In the set of', 'Strings with', 'Word or number patterns (unspec)'],
                            'Users create passwords in the set of passwords to an outside system': ['Users', 'Create Passwords', '\s', 'In the set of', 'passwords', 'To an outside system'],
                            'Users create passwords in the set of passwords to any other system': ['Users', 'Create Passwords', '\s', 'In the set of', 'passwords', 'To any other system'],
                            'Users create passwords in the set of those passwords used /number/ times in the last /number/ years': ['Users', 'Create Passwords', '\s', 'In the set of', 'Those passwords used /number/ times in the last /number/ years', ''],
                            'Users create passwords in the set of proper nouns': ['Users', 'Create Passwords', '\s', 'In the set of', 'Proper nouns', ''],
                            'Users create passwords in the set of incremental changes to existing passwords (unspec)': ['Users', 'Create Passwords', '\s', 'In the set of', 'Incremental changes to existing passwords (unspec)', ''],
                            'Users create passwords in the set of personally identifying information': ['Users', 'Create Passwords', '\s', 'In the set of', 'Personally identifying information', ''],
                            'Users create passwords in the set of vendor default passwords': ['Users', 'Create Passwords', '\s', 'In the set of', 'Vendor default passwords', ''],
                            'Users create passwords in the set of addresses or other locations': ['Users', 'Create Passwords', '\s', 'In the set of', 'Addresses or other locations', ''],
                            'Users create passwords in the set of birthdays or other dates': ['Users', 'Create Passwords', '\s', 'In the set of', 'Birthdays or other dates', ''],
                            'Users create passwords with a substring equal to the user ID': ['Users', 'Create Passwords', 'With a substring', 'Equal to', 'The user ID ', ''],
                            'Users create passwords with a substring equal to their name': ['Users', 'Create Passwords', 'With a substring', 'Equal to', 'Their name ', ''],
                            'Users create passwords with a substring in the set of dictionary words': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Dictionary Words', ''],
                            'Users create passwords with a substring in the set of dictionary words followed by a number': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Dictionary Words + ', 'Followed by a number'],
                            'Users create passwords with a substring in the set of dictionary words in reverse': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Dictionary Words + ', 'In reverse'],
                            'Users create passwords with a substring in the set of dictionary words with numbers substituted for letters': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Dictionary Words + ', 'With numbers substituted for letters'],
                            'Users create passwords with a substring in the set of dictionary words preceded or followed by a number or special character (unspec)': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Dictionary Words + ', 'Preceded or followed by a number or special character (unspec)'],
                            'Users create passwords with a substring in the set of otherwise forbidden content concatenated': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Otherwise forbidden content ', 'Concatenated'],
                            'Users create passwords with a substring in the set of otherwise forbidden contentin reverse': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Otherwise forbidden content ', 'In reverse'],
                            'Users create passwords with a substring in the set of otherwise forbidden content preceded or followed by a number': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Otherwise forbidden content ', 'Preceded or followed by a number'],
                            'Users create passwords with a substring in the set of their last/number/ passwords': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Their last ', '/number/ passwords'],
                            'Users create passwords with a substring in the set of their last/number/ years of passwords': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Their last ', '/number/ years of passwords'],
                            'Users create passwords with a substring in the set of strings with a character repeated /number/ or more times consecutively': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'A character repeated /number/ or more times consecutively'],
                            'Users create passwords with a substring in the set of strings with a character repeated /number/ or more times': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'A character repeated /number/ or more times'],
                            'Users create passwords with a substring in the set of strings with a run of /number/ or more consecutive characters in sequence': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'A run of /number/ or more consecutive characters in sequence'],
                            'Users create passwords with a substring in the set of strings with at least /number/ unique characters': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'At least /number/ unique characters'],
                            'Users create passwords with a substring in the set of strings with characters from /number/ of these /number/ sets:': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'Characters from /number/ of these /number/ sets:'],
                            'Users create passwords with a substring in the set of strings with word or number patterns (unspec)': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Strings with ', 'Word or number patterns (unspec)'],
                            'Users create passwords with a substring in the set of passwords to an outside system': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'passwords ', 'To an outside system'],
                            'Users create passwords with a substring in the set of passwords to any other system': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'passwords ', 'To any other system'],
                            'Users create passwords with a substring in the set of those passwords used /number/ times in the last /number/ years': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Those passwords used /number/ times in the last /number/ years ', ''],
                            'Users create passwords with a substring in the set of proper nouns': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Proper nouns ', ''],
                            'Users create passwords with a substring in the set of incremental changes to existing passwords (unspec)': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Incremental changes to existing passwords (unspec) ', ''],
                            'Users create passwords with a substring in the set of personally identifying information': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Personally identifying information ', ''],
                            'Users create passwords with a substring in the set of vendor default passwords': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Vendor default passwords ', ''],
                            'Users create passwords with a substring in the set of addresses or other locations': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Addresses or other locations ', ''],
                            'Users create passwords with a substring in the set of birthdays or other dates': ['Users', 'Create Passwords', 'With a substring', 'In the set of ', 'Birthdays or other dates ', ''],
                            'Users store passwords in writing anywhere': ['Users', 'Store Passwords', 'In writing', 'Anywhere', '', ''],
                            'Users store passwords in writing in a secure location': ['Users', 'Store Passwords', 'In writing', 'In a secure location', '', ''],
                            'Users store passwords in writing in an unsecure location': ['Users', 'Store Passwords', 'In writing', 'In an unsecure location', '', ''],
                            'Users store passwords in writing in automated scripts': ['Users', 'Store Passwords', 'In writing', 'In automated scripts', '', ''],
                            'Users store passwords in writing in clear text or weakly encrypted': ['Users', 'Store Passwords', 'In writing', 'In clear text or weakly encrypted', '', ''],
                            'Users store passwords in writing in clear text in an unsecure location': ['Users', 'Store Passwords', 'In writing', 'In clear text in an unsecure location', '', ''],
                            'Users store passwords in writing on outside systems': ['Users', 'Store Passwords', 'In writing', 'On outside systems', '', ''],
                            'Users store passwords online anywhere': ['Users', 'Store Passwords', 'Online', 'Anywhere', '', ''],
                            'Users store passwords online in a secure location': ['Users', 'Store Passwords', 'Online', 'In a secure location', '', ''],
                            'Users store passwords online in an unsecure location': ['Users', 'Store Passwords', 'Online', 'In an unsecure location', '', ''],
                            'Users store passwords online in automated scripts': ['Users', 'Store Passwords', 'Online', 'In automated scripts', '', ''],
                            'Users store passwords online in clear text or weakly encrypted': ['Users', 'Store Passwords', 'Online', 'In clear text or weakly encrypted', '', ''],
                            'Users store passwords online in clear text in an unsecure location': ['Users', 'Store Passwords', 'Online', 'In clear text in an unsecure location', '', ''],
                            'Users store passwords online on outside systems': ['Users', 'Store Passwords', 'Online', 'On outside systems', '', ''],
                            'Users fail to authenticate /number/ times in a /number/ /time unit/ interval to avoid administrative unlock or a /number/ /time unit/ lockout': ['Users', 'Fail to authenticate', '/number/ times in a /number/ /time unit/ interval', 'to avoid', 'Administrative unlock or a /number/ /time unit/ lockout', ''],
                            'Users fail to authenticate /number/ times in a /number/ /time unit/ interval to avoid administrative unlock': ['Users', 'Fail to authenticate', '/number/ times in a /number/ /time unit/ interval', 'to avoid', 'Administrative unlock', ''],
                            'Users fail to authenticate /number/ times in a /number/ /time unit/ interval to avoid a lockout of unspecified duration': ['Users', 'Fail to authenticate', '/number/ times in a /number/ /time unit/ interval', 'to avoid', 'A lockout of unspecified duration', ''],
                            'Users fail to authenticate /number/ times in a /number/ /time unit/ interval to avoid a /number/ /time unit/ lockout': ['Users', 'Fail to authenticate', '/number/ times in a /number/ /time unit/ interval', 'to avoid', 'A /number/ /time unit/ lockout', ''],
                            'Users fail to authenticate /number/ times to avoid administrative unlock or a /number/ /time unit/ lockout': ['Users', 'Fail to authenticate', '/number/ times', 'to avoid', 'Administrative unlock or a /number/ /time unit/ lockout ', ''],
                            'Users fail to authenticate /number/ times to avoid administrative unlock': ['Users', 'Fail to authenticate', '/number/ times', 'to avoid', 'Administrative unlock ', ''],
                            'Users fail to authenticate /number/ times to avoid a lockout of unspecified duration': ['Users', 'Fail to authenticate', '/number/ times', 'to avoid', 'A lockout of unspecified duration ', ''],
                            'Users fail to authenticate /number/ times to avoid a /number/ /time unit/ lockout': ['Users', 'Fail to authenticate', '/number/ times', 'to avoid', 'A /number/ /time unit/ lockout ', '']
                            }

    def get_verb_and_children(self, rule):
        """
        Converts a base BNF rule into a list of all parameters necessary for
        our visualization.

        :param rule: String. Our base BNF rule
        :return: List. [verb, child0, child1, child2, child3, child4, child5]
        """
        verb = re.findall("(must not |must |should not |should )", rule)[0]
        rule = rule.replace(verb, "")
        verb = verb.replace("n", "N").replace(" ", "")
        print("Search in hash:", rule)
        return [verb] + self._hash_table.get(rule)
