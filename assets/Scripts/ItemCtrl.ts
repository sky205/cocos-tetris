
import { _decorator, Component, Node, Vec3, Input, input, EventKeyboard, KeyCode } from 'cc';
import { GameCtrl } from './GameCtrl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ItemCtrl
 * DateTime = Thu Jun 23 2022 22:12:16 GMT+0800 (GMT+08:00)
 * Author = max205
 * FileBasename = ItemCtrl.ts
 * FileBasenameNoExtension = ItemCtrl
 * URL = db://assets/Scripts/ItemCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ItemCtrl')
export class ItemCtrl extends Component {
    
    MAX_WIDTH = 400;
    MAX_HEIGHT = 800;
    CUBE_SIZE = 40;

    HOR_MOVE_MS = 0.1;
    VERT_MOVE_MS = 0.05;

    oritation: number = 0;
    childrenPos: Array<Vec3> = [];
    movePos: Vec3 = new Vec3();

    curHeight: number = 0;
    curWidth: number = 0;

    isEnd: boolean = false;
    isFinishMoving: boolean = false;
    askTransform: boolean = false;
    askMove: boolean = false;
    askMoveEnd: boolean = false;

    horMoveTimer = 0;
    vertMoveTimer = 0;

    gameCtrl: GameCtrl;


    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyboardDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyboardUp, this);
        this.transform(0);


        this.node.setPosition(new Vec3(120, this.MAX_HEIGHT, 0));
    }

    transform(index: number) {
        console.log(`please overwrite this function`);
        throw "please overwrite this function";    
    }

    onKeyboardUp(event: EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_LEFT:
                this.askMove = false;
                break;

            case KeyCode.ARROW_RIGHT:
                this.askMove = false;
                break;

            default:
                break;
        }
    }

    onKeyboardDown(event: EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_DOWN:

                break;

            case KeyCode.ARROW_LEFT:
                do {
                    let curPos = this.node.getPosition();
                    if (curPos.x <= 0){
                        break;
                    }
                    this.movePos.x = -40;
                    this.askMove = true;
                    this.horMoveTimer = this.HOR_MOVE_MS;
                } while (false);
                break;
            
            case KeyCode.SPACE:
                //console.log(`ask move to end`);
                this.askMoveEnd = true;
                this.vertMoveTimer = this.VERT_MOVE_MS;
                break;

            case KeyCode.ARROW_RIGHT:
                do {
                    let curPos = this.node.getPosition();
                    if (curPos.x >= (this.MAX_WIDTH - this.curWidth)){
                        break;
                    }
                    this.movePos.x = 40;
                    this.askMove = true;
                    this.horMoveTimer = this.HOR_MOVE_MS;
                } while (false);
                break;

            case KeyCode.ARROW_UP:
                this.transform(1);
                break;

        }
    }

    doHorMove(){
        if (!this.askMove)
            return;

        let curPos = this.node.getPosition();
        let movePos = curPos;
        let endOfLeft = 0;
        let endOfRight = this.MAX_WIDTH - this.curWidth;

        if (this.movePos.x == -40){
            if (curPos.x <= endOfLeft){
                movePos.x = endOfLeft;
                this.askMove = false;
            } else {
                movePos.add(this.movePos);
            }
        } else if (this.movePos.x == 40){
            if (curPos.x >= endOfRight){
                movePos.x = endOfRight
                this.askMove = false;
            } else {
                movePos.add(this.movePos);
            }
        }

        if (this.gameCtrl.hasNode(this.node, movePos)) {
            this.askMove = false;
        } else {
            this.node.setPosition(movePos);
        }
    }

    doVertMove(){
        let curPos = this.node.getPosition();
        let movePos = Object.assign({}, curPos);
        let endOfBottom = this.gameCtrl.getEndOfItem(this.node);

        if (curPos.y <= endOfBottom){
            this.isEnd = true;
            //console.log(`doVertMove set end to true`)
        } else{
            //console.log(`move dowm`);
            movePos.y = this.askMoveEnd ? endOfBottom : movePos.y - this.CUBE_SIZE;
            this.node.setPosition(movePos);
        }
        
    }

    borderChecking(){
        let curPos = this.node.getPosition();
        let movePos: Vec3 = Object.assign({}, curPos);
        let endOfLeft = 0;
        let endOfRight = (this.MAX_WIDTH - this.curWidth);
        let endOfBottom = 0;
        
        if (curPos.x <= endOfLeft)
            movePos.x = endOfLeft;

        if (curPos.x >= endOfRight)
            movePos.x = endOfRight;

        if (curPos.y <= endOfBottom) {
            //console.log(`curPosY: ${curPos.y}, endOfBottom: ${endOfBottom}`)
            movePos.y = endOfBottom;
            this.isEnd = true;
        }
        else
            this.isEnd = false;

        if (curPos.x != movePos.x || curPos.y != movePos.y){
            this.node.setPosition(movePos);
            //console.log(`adjust position to ${JSON.stringify(movePos)}`);
        }
            
    }

    update (deltaTime: number) {
        if (this.isFinishMoving)
            return;
        
        let needChecking = false;
        if (this.askTransform){
            if (this.gameCtrl.allowTransform(this.node, this.childrenPos)) {
                //console.log(`do transform`);
                this.node.children.forEach((item, index) => {
                    item.setPosition(this.childrenPos[index]);
                });
                this.borderChecking();;
            } else {
                //console.log(`has node at transform pos, so reject transform`);
            }
            this.askTransform = false;
        }
        
        if (this.horMoveTimer > this.HOR_MOVE_MS){
            if (this.askMove){
                needChecking = true;
                this.doHorMove();
            }
            this.horMoveTimer = 0;
        } else {
            this.horMoveTimer += deltaTime;
        }


        if (this.isEnd == false){
            if (this.vertMoveTimer < this.VERT_MOVE_MS){
                this.vertMoveTimer += deltaTime;
            } else {
                this.doVertMove();
                this.vertMoveTimer = 0;
            }
        }

        if (needChecking){
            this.borderChecking();
        }

        if (this.isEnd){
            this.isFinishMoving = true;
            this.node.emit('OnItemFinish');
        }
        
    }


    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
