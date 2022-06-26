
import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { ItemCtrl } from './ItemCtrl';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameCtrl
 * DateTime = Thu Jun 23 2022 21:38:33 GMT+0800 (GMT+08:00)
 * Author = max205
 * FileBasename = GameCtrl.ts
 * FileBasenameNoExtension = GameCtrl
 * URL = db://assets/Scripts/GameCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */


@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property({ type: Prefab })
    public SingleCude: Prefab | null = null;

    @property({ type: Prefab })
    public ItemTPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemOPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemIPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemSPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemZPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemJPrefab: Prefab | null = null;
    
    @property({ type: Prefab })
    public ItemLPrefab: Prefab | null = null;
    
    @property({ type: Node })
    public TetrisArea: Node | null = null;

    @property({ type: Node })
    public PredictNode: Node | null = null;

    private currentItem: ItemCtrl;
    private nextItem: ItemCtrl;

    private cubes: Array<Array<Node|null>> = [];

    start () {

        for(let i = 0; i < 10; i++){
            this.cubes.push([]);
            for(let j = 0; j < 25; j++){
                this.cubes[i].push(null);
            }
        }

        //console.log(this.cubes);

        //this.testForFill();

        setTimeout(() => {
            this.generateCurrentItem();
        }, 3000);
    }

    testForFill() {
        console.log(`create test cube`);
        for(let row = 0; row < 5; row++) {
            for(let col = 0; col < 8; col++) {
                let node = instantiate(this.SingleCude);
                this.TetrisArea.addChild(node);
                this.cubes[col][row] = node;
                let pos = new Vec3(40 * col, 40 * row, 0);
                node.setPosition(pos);
                node.active = true;
            }
        }
    }

    generateItem(): ItemCtrl {
        let list = [ this.ItemIPrefab, this.ItemJPrefab, this.ItemLPrefab, this.ItemOPrefab, this.ItemSPrefab, this.ItemZPrefab, this.ItemTPrefab ];
        let randomIndex = Math.floor(Math.random() * list.length);
        console.log(`radom: ${randomIndex}`);
        let nextNode = instantiate(list[randomIndex]);
        let ctrl = nextNode.getComponent(ItemCtrl);
        ctrl.gameCtrl = this;
        return ctrl;
    }

    generateNextItem() {
        this.nextItem = this.generateItem();
    }

    generateCurrentItem(){
        console.log(`generate current item`);

        if (this.nextItem != null){
            this.currentItem = this.nextItem;
        } else {
            this.currentItem = this.generateItem();
        }
        this.currentItem.node.on('OnItemFinish', this.OnItemFinish, this);
        this.generateNextItem();

        this.TetrisArea.addChild(this.currentItem.node);
        this.currentItem.transform(0);
        this.currentItem.node.active = true;
    }

    setPredictChildNodePos = () => {

    }


    getEndOfItem = (node: Node): number => {
        let pos = node.getPosition();
        let endItem = node.children.map((item, index) => {
            let itemPos = item.getPosition();
            this.PredictNode.children[index].setPosition(itemPos);
            let map = { col: ((pos.x + itemPos.x) / 40), row: ((pos.y + itemPos.y) / 40) };
            //console.log(`${pos.x + itemPos.x} to [${(pos.x + itemPos.x) / 40}], ${pos.y + itemPos.y} to [${(pos.y + itemPos.y) / 40}]`);
            return map;
        });

        let isEnd = false;
        let isHasNode = false;
        while(!isEnd) {
            let toEnd = endItem.find((item) => {
                if (this.cubes[item.col][item.row] != null) {
                    isHasNode = true;
                    return true;
                } else if (item.row <= 0){
                    return true;
                }
            });

            if (toEnd) {
                isEnd = true;
            } else {
                endItem = endItem.map((item) => { item.row -= 1; return item; });
            }
        }

        let endIndex = 20;
        endItem.forEach((item) => {
            endIndex = item.row < endIndex ? item.row : endIndex;
        })

        //console.log(`endIndex: ${endIndex}`);
        
        let endY = isHasNode ? (endIndex + 1) * 40 : endIndex * 40;
        this.PredictNode.setPosition(new Vec3(pos.x, endY, 0));
        return endY;
    }

    allowTransform = (tetrisNode: Node, childTargetPos: Array<Vec3>) => {
        let pos = tetrisNode.getPosition();
        let maps = childTargetPos.map((item) => {
            return { col: (item.x + pos.x) / 40, row: (item.y + pos.y) / 40 };
        });


        let hasNode = maps.find((item) => {
            if (this.cubes.length > item.col && this.cubes[item.col].length > item.row) {
                return this.cubes[item.col][item.row] != null;
            } else {
                return false;
            }
        })

        return !hasNode;
    }

    hasNode = (TeterisItem: Node, movePos: Vec3): boolean => {
        let maps = TeterisItem.children.map((item) => {
            let itemPos = item.getPosition();
            return { col: (itemPos.x + movePos.x) / 40, row: (itemPos.y + movePos.y) / 40 };
        })

        let hasNode = maps.find((itemIndex) => {
            if (this.cubes[itemIndex.col][itemIndex.row] != null) {
                return true;
            }
        });

        return hasNode != null;
    }

    getEndOfCol = (pos: Vec3, cube: Node): number => {
        let cubePos = cube.getPosition()
        let col = (pos.x + cubePos.x) / 40;
        let rowStart = (pos.y + cubePos.y) / 40;
        rowStart = rowStart >= 20 ? 19 : rowStart;
        
        for(let row = rowStart; row >= 0; row--) {
            if (this.cubes[col][row] != null) {
                return (row+1) * 40;
            }
        }
    }

    clearFillLines = () => {
        let fillRows = [];
        for(let row = 0; row < 20; row++) {
            let hasEmpty = false;
            for(let col = 0; col < 10; col++) {
                if (this.cubes[col][row] == null){
                    hasEmpty = true;
                }
            }
            if (!hasEmpty) {
                fillRows.push(row);
            }
        }
        
        fillRows.forEach((row) => {
            for(let col = 0; col < 10; col++) {
                let node = this.cubes[col][row];
                node.active = false;
                node.destroy();
                this.cubes[col][row] = null;
            }
        })

        if (fillRows.length == 0) {
            return;
        }

        //console.log(`clear ${fillRows.length} lines`);

        let dumprows = 0;
        
        for(let row = 0; row < 20; row++) {
            let isClearRow = fillRows.find((item) => item == row);
            
            if (isClearRow === undefined && dumprows > 0) {
                for(let j = row; j < 20; j++) { // row
                    for(let i = 0; i < 10; i++) { // col
                        if (this.cubes[i][j] != null) {
                            let node = this.cubes[i][j];
                            let newPos = new Vec3(40 * i, (j-dumprows) * 40, 0);
                            node.setPosition(newPos);
                            //console.log(`set node [${j}][${i}] to [${j-dumprows}][${i}], pos: (${newPos.x},${newPos.y})`);
                        }
                        this.cubes[i][j-dumprows] = this.cubes[i][j];
                        this.cubes[i][j] = null;
                    }
                }
                dumprows = 0;
            } else {
                dumprows += isClearRow === undefined ? 0 : 1;
            }
        }

    }


    OnItemFinish() {
        console.log(`recv OnItemFinish`);

        // add node to cubs array
        let pos = this.currentItem.node.getPosition();
        this.currentItem.node.children.forEach((item) => {
            let itemPos = item.getPosition();
            let x = pos.x + itemPos.x;
            let y = pos.y + itemPos.y;
            
            let node = instantiate(this.SingleCude);
            node.setPosition(new Vec3(x, y, 0));
            this.TetrisArea.addChild(node);
            node.active = true;

            let i = x / 40;
            let j = y / 40;
            this.cubes[i][j] = node;
        })

        this.currentItem.destroy();
        this.currentItem.node.active = false;
        this.currentItem.node.destroy();
        this.clearFillLines();
        this.generateCurrentItem();



        for(let row = 19; row > -1; row--) {
            let str = "|";
            for(let col = 0; col < 10; col++) {
                str += this.cubes[col][row] == null ? "☐" : "☑"
            }
            str += "|";
            console.log(str);
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
