export class Utils {

    static truncateId(id: number | string | null): string {
        if (id && id !== 0) {
          return id.toString().slice(-8);
        }
        return '';
    }

    static generateHexColorFromString(input: string): string {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
          hash = input.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        // Convert the hash to a hex color
        let color = '#';
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xff;
          color += ('00' + value.toString(16)).slice(-2);
        }
    
        return color;
    }
}