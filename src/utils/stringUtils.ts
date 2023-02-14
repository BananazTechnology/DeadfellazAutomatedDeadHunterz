export class StringUtils {
  public static startsWith(content: string, gameCommand: string) : boolean {
    if (content.length < 0) return false;
    if (gameCommand.length < 0) return false;
    if (content.length < gameCommand.length) return false;

    var contentNeat = content.toLowerCase().trim();
    var commandNeat = gameCommand.toLowerCase().trim();
    var commandSize = commandNeat.length;
    var contentCommand = contentNeat.substring(0, commandSize);

    return (contentCommand === commandNeat);
  }

  public static csvStringToArray(csvString : string) : string[] {
    if(csvString === null) return [];
    if(csvString.length < 1) return [];
    return csvString.split(',').map(s => s.trim());
  }
  public static arrayToCsvString(array : string[]) : string {
    if(array === null) return '';
    if(array.length < 1) return '';
    return array.join(',');
  }
}