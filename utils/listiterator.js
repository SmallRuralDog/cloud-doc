class Iterator{
	/**
	 * 构造函数传入数组
	 */
	constructor(arr){
		this.arr = arr;
		this.size = this.arr.length;
		this.i = 0;
	}
	/**
	 * 获取下一个元素
	 */
	next(){
		var temp = this.arr[this.i];
		this.i++;
		return temp;
	}
	/**
	 * 删除当前元素
	 */
	remove(){
		this.arr.splice(--this.i,1);
	}
	/**
	 * 是否存在下一个元素
	 */
	hasNext(){
		if(this.arr == null || this.arr.length == this.i) return false;
		return true;
	}
	/**
	 * 判断是否存在上一个元素
	 */
	hasPrevious(){
		return this.i != 0;
	}
	/**
	 * 逆向遍历,获取上一个元素
	 */
	previous(){
		this.i--;
		var temp = this.arr[this.i];
		return temp;
	}
	/**
	 * 替换当前指针指向元素
	 */
	set(e){
		this.arr[this.i - 1] = e;
	}
	/**
	 * 返回对 next 的后续调用所返回元素的索引
	 */
	nextIndex(){
		return this.i;
	}
}

module.exports = Iterator;