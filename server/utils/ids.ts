import { ulid } from 'ulidx';
import { PublicIDPrefixes } from '../config/prefixes';

export function generatePublicID(prefix: string) {
  let ulidString = generateULID();
  ulidString = ulidString.toLowerCase();
  ulidString = cleanedIDPrefix(prefix) + '_' + ulidString;
  return ulidString;
}

function cleanedIDPrefix(idPrefix: string) {
  if (idPrefix.length >= 10) {
    return idPrefix.slice(0, 10);
  }

  const prefix = PublicIDPrefixes.DEFAULT_PREFIX;

  switch (idPrefix.length) {
    case 0:
      return prefix;
    case 1:
      return prefix.slice(0, 2) + idPrefix;
    case 2:
      return prefix.slice(0, 1) + idPrefix;
    default: {
      if (idPrefix.length > 10) {
        idPrefix = idPrefix.slice(0, 10);
      }
      return idPrefix;
    }
  }
}

function generateULID() {
  const id = ulid(new Date().getTime());
  return id;
}