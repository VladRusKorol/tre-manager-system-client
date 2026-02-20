export class SignalEmmiter {

    signalName: string;
    onSubscribeSignalNames: string[]

    constructor(pSignalName: string, pOnSubscribeSignalNames: string[] ){
        this.signalName = pSignalName;
        this.onSubscribeSignalNames = pOnSubscribeSignalNames;
    }

    public emit(){
      window.dispatchEvent(new CustomEvent(this.signalName));
    }

    public on(handler: () => void){
        this.onSubscribeSignalNames.forEach((signalName: string)=> {
            window.addEventListener(signalName, handler)
        })
    }

    public off(handler: () => void){
        this.onSubscribeSignalNames.forEach((signalName: string)=> {
            window.removeEventListener(signalName, handler)
        })
    }
    
}