

export class typeHelpder {

    public static isNull(data: any): boolean {
        if (data != null) {
            return false;
        }

        if (data != undefined) {
            return false;
        }
        return true;
    }
}
