import socketio from 'socket.io-client';
import history from "./history";

const SERVER_TYPE = process.env.REACT_APP_SERVER_TYPE;
const MOBILE_SERVER_TYPE = process.env.REACT_APP_MOBILE_SERVER_TYPE;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ? process.env.REACT_APP_SOCKET_URL : "https://tracker.carenation.kr";

const SOCKET_SERVER = SERVER_TYPE === "REAL" ? socketio ? socketio.connect(SOCKET_URL, {path: '/protector', reconnectionAttempts: 10}) : null : null;

const SOCKET_TYPE_VIEW = 0x01;
const SOCKET_TYPE_STAY = 0x02;
const SOCKET_TYPE_ACTION = 0x03;
const SOCKET_TYPE_CLICK = 0x04;
const SOCKET_TYPE_ = 0x05;

const SOCKET_KEY_NONE = 0x00;
const SOCKET_KEY_PATH = 0x01;
const SOCKET_KEY_TIME = 0x02;
const SOCKET_KEY_CODE = 0x03;
const SOCKET_KEY_STATE = 0x04;
const SOCKET_KEY_DATA = 0x05;

const STORAGE_USER_ID = "user_id";

export class SocketIO {

    private location: any = history.location;

    private socketInitTime: number = 0x00;
    private socketTypeCode: string = "";
    private mUserID: string = "";

    constructor(typeCode: string) {
        if (SERVER_TYPE !== "REAL" && SERVER_TYPE !== "MOBILE") {
            return;
        }
        if (SERVER_TYPE === "MOBILE" && (MOBILE_SERVER_TYPE === "CI" || MOBILE_SERVER_TYPE === "QA")) {
            return;
        }
        this.socketTypeCode = (SERVER_TYPE === "MOBILE" && MOBILE_SERVER_TYPE === "REAL") ? typeCode.replace("P-", "M-") : typeCode;
        this.socketInitTime = new Date().getTime();
        this.init();
    }

    //##################################################################################################################
    //##
    //## >> Function :
    //##
    //##################################################################################################################

    /**
     * 화면 머무르는 시간
     * -----------------------------------------------------------------------------------------------------------------
     */
    private init(): void {
        this.viewPage();
    }

    /**
     * FUNC : 사용자 아이디 가져 오기
     * -----------------------------------------------------------------------------------------------------------------
     * @return : String 사용자 아이디
     */
    private getUserID(): string {
        if (!this.mUserID) {
            let userID = localStorage.getItem(STORAGE_USER_ID);
            this.mUserID = userID ? userID : "";
        }
        SocketIO.userID = this.mUserID;
        return this.mUserID;
    }

    //##################################################################################################################
    //##
    //## >> Public Method :
    //##
    //##################################################################################################################

    /**
     * 화면 머무르는 시간
     * -----------------------------------------------------------------------------------------------------------------
     */
    public viewStay(): void {
        if (SOCKET_SERVER === null) {
            return;
        }
        try {
            let nowTime = new Date().getTime();
            let data = {
                id: this.getUserID(),
                type: SOCKET_TYPE_STAY,
                code: this.socketTypeCode,
                key: SOCKET_KEY_TIME,
                val: nowTime - this.socketInitTime
            };
            SOCKET_SERVER.emit("action", data);
        } catch (e: any) {
            console.log("viewStay : " + e.toString());
        }
    }

    /**
     * 화면 호출 페이지
     * -----------------------------------------------------------------------------------------------------------------
     */
    public viewPage(): void {
        if (SOCKET_SERVER === null) {
            return;
        }
        try {
            let data = {
                id: this.getUserID(),
                type: SOCKET_TYPE_VIEW,
                code: this.socketTypeCode,
                key: SOCKET_KEY_PATH,
                val: {
                    pathname: this.location.pathname,
                    search: this.location.search
                }
            };
            SOCKET_SERVER.emit("action", data);
        } catch (e: any) {
            console.log("viewPage : " + e.toString());
        }
    }

    /**
     * 화면 행동 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
    public viewAction(): void {
        if (SOCKET_SERVER === null) {
            return;
        }
        try {
            let data = {
                id: this.getUserID(),
                type: SOCKET_TYPE_ACTION,
                code: this.socketTypeCode,
                key: SOCKET_KEY_PATH,
                val: {
                    pathname: this.location.pathname,
                    search: this.location.search
                }
            };
            SOCKET_SERVER.emit("action", data);
        } catch (e: any) {
            console.log("viewAction : " + e.toString());
        }
    }

    //##################################################################################################################
    //##
    //## >> ON Action :
    //##
    //##################################################################################################################

    /**
     * Server ON
     * -----------------------------------------------------------------------------------------------------------------
     */
    public onAction(key: string, callback: any): void {
        if (SOCKET_SERVER === null) {
            return;
        }
        try {
            SOCKET_SERVER.on(key, callback);
        } catch (e: any) {
            console.log("onAction : " + e.toString());
        }
    }

    //##################################################################################################################
    //##
    //## >> Action :
    //##
    //##################################################################################################################

    static userID: string;

    /**
     * 화면 행동 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
    static viewClick(val: any): void {
        if (SOCKET_SERVER === null) {
            return;
        }
        try {
            let data = {
                id: SocketIO.userID,
                type: SOCKET_TYPE_CLICK,
                code: "",
                key: SOCKET_KEY_CODE,
                val: val
            };
            SOCKET_SERVER.emit("action", data);
        } catch (e: any) {
            console.log("viewClick : " + e.toString());
        }
    }
}

export default SocketIO;
