class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        let keyword=this.queryStr.keyword;
        keyword=keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }
        :
        {}
        this.query=this.query.find({...keyword});
        return this;
    }
    filter(){
        let catagory=this.queryStr.catagory;
        catagory=catagory?{
            catagory:{
                $regex:this.queryStr.catagory,
                $options:"i",
            }
        }
        :
        {}
        this.query=this.query.find({...catagory});
        return this;
    }
    filterName(){
        let vendorName=this.queryStr.vendorName;
        vendorName=vendorName?{
            vendorName:{
                $regex:this.queryStr.vendorName,
                $options:"i",
            }
        }
        :
        {}
        this.query=this.query.find({...vendorName});
        return this;
    }
}
module.exports = ApiFeatures