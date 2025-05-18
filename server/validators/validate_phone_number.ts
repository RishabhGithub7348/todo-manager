import phone from "phone";
import { getErrorMessage } from "../oplog/error";
import oplog from "../oplog/oplog";

export function ValidatePhone(phoneNumber: string, country: string): Error | string {
	const checkNumber = phone(phoneNumber, { country: country });

	if (!checkNumber.isValid) {
		const err = new Error("Invalid phone number");
		oplog.error("error validating phone number: " + getErrorMessage(err));
		return err;
	}

	return checkNumber.phoneNumber;
}
