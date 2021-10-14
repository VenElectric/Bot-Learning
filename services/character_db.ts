const { db } = require("./firebasesetup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection('sessions')

function add_character(sessionid:string,pcargs:string[]){
        let pcid = uuidv4()
        
        let options = {
            id: pcid,
            name:pcargs[0],
            init:Number(pcargs[1]),
            init_mod:Number(pcargs[2]),
            line_order:0,
            cmark:false,
            status_effects:[],
            npc:Boolean(pcargs[3]),
        }
        initRef.doc(sessionid).collection('initiative').doc(pcid)
        .set(options)
        .then(async ()=>{
            let sorted = await initRef.doc(sessionid).get()
            if (sorted){
                initRef.doc(sessionid).set({sorted:false},{merge:true}).then(()=>{
                    return true
                })
                .catch((error:any) => {
                    return error
                })
            }
            else{
                return true
            }
        }).catch((error:any) => {
           return error
        })

}

function update_character(){

}

function delete_character(){
    
}

export {}