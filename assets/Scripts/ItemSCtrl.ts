
import { _decorator, Component, Node, Vec3, Input, input, EventKeyboard, KeyCode } from 'cc';
import { ItemCtrl } from './ItemCtrl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ItemTCtrl
 * DateTime = Thu Jun 23 2022 22:12:34 GMT+0800 (GMT+08:00)
 * Author = max205
 * FileBasename = ItemTCtrl.ts
 * FileBasenameNoExtension = ItemTCtrl
 * URL = db://assets/Scripts/ItemTCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ItemSCtrl')
export class ItemSCtrl extends ItemCtrl {
    // [1]
    // dummy = '';

    start(){
        super.start();
    }

    transform(index: number) {
        this.oritation += index;
        this.oritation %= 2;
        
        console.log(`go oritaion: ${this.oritation}`);
        
        this.askTransform = true;
        this.childrenPos = [];
        switch(this.oritation){
            case 0:
                this.curHeight = this.CUBE_SIZE * 2;
                this.curWidth = this.CUBE_SIZE * 3;
                this.childrenPos.push(new Vec3(0, 0, 0));
                this.childrenPos.push(new Vec3(40, 0, 0));
                this.childrenPos.push(new Vec3(40, 40, 0));
                this.childrenPos.push(new Vec3(80, 40, 0));
                break;
        
            case 1:
                this.curHeight = this.CUBE_SIZE * 3;
                this.curWidth = this.CUBE_SIZE * 2;
                this.childrenPos.push(new Vec3(0, 80, 0));
                this.childrenPos.push(new Vec3(0, 40, 0));
                this.childrenPos.push(new Vec3(40, 40, 0));
                this.childrenPos.push(new Vec3(40, 0, 0));
                break;
        
        
            default:
                this.askTransform = false;
                console.log(`undefined this oritation, please define it`);
        }
            
    }

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
