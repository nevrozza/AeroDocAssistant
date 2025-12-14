export class StringUtils {
    static isBlank(str: string | null | undefined): boolean {
        return !str || str.trim().length === 0;
    }

    static isNotBlank(str: string | null | undefined): str is string {
        return !!str && str.trim().length > 0;
    }

    static isEmpty(str: string | null | undefined): boolean {
        return !str || str.length === 0;
    }

    static isNotEmpty(str: string | null | undefined): str is string {
        return !!str && str.length > 0;
    }
}
