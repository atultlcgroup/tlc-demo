class A {
  a = ``;
  A(){
    if(a)
    return a;
    else{
      a = new A()
      return a;
  }
}

}

