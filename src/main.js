import { Peer } from "./peerjs.min.js";

/** The fundamental set up and animation structures for Pointer Visualization */
export default class Main {

    constructor() {
        // Intercept Main Window Errors
        window.realConsoleError = console.error;
        window.addEventListener('error', (event) => {
            let path = event.filename.split("/");
            this.display((path[path.length - 1] + ":" + event.lineno + " - " + event.message));
        });
        console.error = this.fakeError.bind(this);
        this.deferredConstructor();
        this.updateFunction = this.update.bind(this);
    }

    async deferredConstructor() {
        this.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        // Create the Cursor Object
        this.trail = [];
        for(let i = 0; i < 1; i++){
            let trail = document.createElement("div");
            trail.id = "cursor";
            trail.style.position = "absolute";
            trail.style.width = "10px";
            trail.style.height = "10px";
            trail.style.backgroundColor = this.isMobile ? "green" : "red";
            trail.style.borderRadius = "50%";
            trail.style.userSelect = "none";
            trail.style.pointerEvents = "none";
            document.body.appendChild(trail);
            this.trail.push(trail);
        }

        // Get the connection id out of the hash parameters in the url
        let hash = window.location.hash;
        if(hash.length > 1){
            this.hostID = hash.substring(1);
        }

        window.addEventListener("pointermove", (event) => {
            event.preventDefault(); event.stopPropagation();
            this.updateTrail(event.pageX, event.pageY);

            if(this.conn){ this.conn.send(JSON.stringify({"id": event.pointerId, "x":event.pageX, "y":event.pageY})); }
        }, {passive: false});

        if(this.isMobile){
            console.log("Creating Mobile Client");
            this.peer = new Peer(null, {
                debug: 2
            });
            this.peer.on("open", (id) => { 
                console.log("Peer Opened: " + id); 
            
                // Connecting to someone else
                this.conn = this.peer.connect("SideswypeGlobalHost");
                this.conn.on("open", (id) => { this.conn.send("hi!" + id); console.log("Sent Hi to: " + id); });
            });
        } else {
            console.log("Creating Host");
            console.log(Peer);
            this.peer = new Peer("SideswypeGlobalHost", {
                debug: 2
            });
            this.peer.on("open", (id) => {
                console.log("Peer Opened: " + id); 
                window.location.hash = id;
            });

            // Someone connecting to us
            this.peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    if(data.startsWith("{")){
                        let parsed = JSON.parse(data);
                        this.updateTrail(parsed.x, parsed.y);
                    }
                });
                conn.on("open", (id) => { conn.send("hello!"+id); });
            });
        }
    }

    updateTrail(x, y){
        let trail = this.trail.shift();
        trail.style.left = x + "px";
        trail.style.top = y + "px";
        this.trail.push(trail);
    }

    update() {
        requestAnimationFrame(this.updateFunction);
    }

    mobileCheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    // Log Errors as <div>s over the main viewport
    fakeError(...args) {
        if (args.length > 0 && args[0]) { this.display(JSON.stringify(args[0])); }
        window.realConsoleError.apply(console, arguments);
    }

    display(text) {
        let errorNode = window.document.createElement("div");
        errorNode.innerHTML = text.fontcolor("red");
        window.document.getElementById("info").appendChild(errorNode);
    }
}

var main = new Main();
