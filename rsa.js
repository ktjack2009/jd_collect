var biRadixBase=2,biRadixBits=16,bitsPerDigit=biRadixBits,biRadix=65536,biHalfRadix=biRadix>>>1,biRadixSquared=biRadix*biRadix,maxDigitVal=biRadix-1,maxInteger=9999999999999998,maxDigits,ZERO_ARRAY,bigZero,bigOne;
var hexatrigesimalToChar=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
var hexToChar=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
var highBitMasks=new Array(0,32768,49152,57344,61440,63488,64512,65024,65280,65408,65472,65504,65520,65528,65532,65534,65535);
var lowBitMasks=new Array(0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535);


function BarrettMu(i){this.modulus=biCopy(i),this.k=biHighIndex(this.modulus)+1;var t=new BigInt;t.digits[2*this.k]=1,this.mu=biDivide(t,this.modulus),this.bkplus1=new BigInt,this.bkplus1.digits[this.k+1]=1,this.modulo=BarrettMu_modulo,this.multiplyMod=BarrettMu_multiplyMod,this.powMod=BarrettMu_powMod}
function BarrettMu_modulo(i){var t=biDivideByRadixPower(i,this.k-1),r=biMultiply(t,this.mu),e=biDivideByRadixPower(r,this.k+1),n=biModuloByRadixPower(i,this.k+1),g=biMultiply(e,this.modulus),s=biModuloByRadixPower(g,this.k+1),d=biSubtract(n,s);d.isNeg&&(d=biAdd(d,this.bkplus1));for(var o=biCompare(d,this.modulus)>=0;o;)d=biSubtract(d,this.modulus),o=biCompare(d,this.modulus)>=0;return d}
function BarrettMu_multiplyMod(i,t){var r=biMultiply(i,t);return this.modulo(r)}
function BarrettMu_powMod(i,t){var r=new BigInt;r.digits[0]=1;for(var e=i,n=t;;){if(0!=(1&n.digits[0])&&(r=this.multiplyMod(r,e)),n=biShiftRight(n,1),0==n.digits[0]&&0==biHighIndex(n))break;e=this.multiplyMod(e,e)}return r}
function setMaxDigits(i){maxDigits=i,ZERO_ARRAY=new Array(maxDigits);for(var t=0;t<ZERO_ARRAY.length;t++)ZERO_ARRAY[t]=0;bigZero=new BigInt,bigOne=new BigInt,bigOne.digits[0]=1}
function BigInt(i){"boolean"==typeof i&&1==i?this.digits=null:this.digits=ZERO_ARRAY.slice(0),this.isNeg=!1}
function biCopy(i){var t=new BigInt((!0));return t.digits=i.digits.slice(0),t.isNeg=i.isNeg,t}
function biFromNumber(i){var t=new BigInt;t.isNeg=i<0,i=Math.abs(i);for(var r=0;i>0;)t.digits[r++]=i&maxDigitVal,i>>=biRadixBits;return t}
function biToString(i,t){var r=new BigInt;r.digits[0]=t;for(var e=biDivideModulo(i,r),n=hexatrigesimalToChar[e[1].digits[0]];1==biCompare(e[0],bigZero);)e=biDivideModulo(e[0],r),digit=e[1].digits[0],n+=hexatrigesimalToChar[e[1].digits[0]];return(i.isNeg?"-":"")+reverseStr(n)}
function digitToHex(t){var r=15,e="";for(i=0;i<4;++i)e+=hexToChar[t&r],t>>>=4;return reverseStr(e)}
function biToHex(i){for(var t="",r=(biHighIndex(i),biHighIndex(i));r>-1;--r)t+=digitToHex(i.digits[r]);return t}
function charToHex(i){var t,r=48,e=r+9,n=97,g=n+25,s=65,d=90;return t=i>=r&&i<=e?i-r:i>=s&&i<=d?10+i-s:i>=n&&i<=g?10+i-n:0}
function hexToDigit(i){for(var t=0,r=Math.min(i.length,4),e=0;e<r;++e)t<<=4,t|=charToHex(i.charCodeAt(e));return t}
function biFromHex(i){for(var t=new BigInt,r=i.length,e=r,n=0;e>0;e-=4,++n)t.digits[n]=hexToDigit(i.substr(Math.max(e-4,0),Math.min(e,4)));return t}
function biToBytes(i){for(var t="",r=biHighIndex(i);r>-1;--r)t+=digitToBytes(i.digits[r]);return t}
function digitToBytes(i){var t=String.fromCharCode(255&i);i>>>=8;var r=String.fromCharCode(255&i);return r+t}
function biAdd(i,t){var r;if(i.isNeg!=t.isNeg)t.isNeg=!t.isNeg,r=biSubtract(i,t),t.isNeg=!t.isNeg;else{r=new BigInt;for(var e,n=0,g=0;g<i.digits.length;++g)e=i.digits[g]+t.digits[g]+n,r.digits[g]=65535&e,n=Number(e>=biRadix);r.isNeg=i.isNeg}return r}
function biSubtract(i,t){var r;if(i.isNeg!=t.isNeg)t.isNeg=!t.isNeg,r=biAdd(i,t),t.isNeg=!t.isNeg;else{r=new BigInt;var e,n;n=0;for(var g=0;g<i.digits.length;++g)e=i.digits[g]-t.digits[g]+n,r.digits[g]=65535&e,r.digits[g]<0&&(r.digits[g]+=biRadix),n=0-Number(e<0);if(n==-1){n=0;for(var g=0;g<i.digits.length;++g)e=0-r.digits[g]+n,r.digits[g]=65535&e,r.digits[g]<0&&(r.digits[g]+=biRadix),n=0-Number(e<0);r.isNeg=!i.isNeg}else r.isNeg=i.isNeg}return r}
function biHighIndex(i){for(var t=i.digits.length-1;t>0&&0==i.digits[t];)--t;return t}
function biNumBits(i){var t,r=biHighIndex(i),e=i.digits[r],n=(r+1)*bitsPerDigit;for(t=n;t>n-bitsPerDigit&&0==(32768&e);--t)e<<=1;return t}
function biMultiply(i,t){for(var r,e,n,g=new BigInt,s=biHighIndex(i),d=biHighIndex(t),o=0;o<=d;++o){for(r=0,n=o,j=0;j<=s;++j,++n)e=g.digits[n]+i.digits[j]*t.digits[o]+r,g.digits[n]=e&maxDigitVal,r=e>>>biRadixBits;g.digits[o+s+1]=r}return g.isNeg=i.isNeg!=t.isNeg,g}
function biMultiplyDigit(i,t){var r,e,n;result=new BigInt,r=biHighIndex(i),e=0;for(var g=0;g<=r;++g)n=result.digits[g]+i.digits[g]*t+e,result.digits[g]=n&maxDigitVal,e=n>>>biRadixBits;return result.digits[1+r]=e,result}
function arrayCopy(i,t,r,e,n){for(var g=Math.min(t+n,i.length),s=t,d=e;s<g;++s,++d)r[d]=i[s]}
function biShiftLeft(i,t){var r=Math.floor(t/bitsPerDigit),e=new BigInt;arrayCopy(i.digits,0,e.digits,r,e.digits.length-r);for(var n=t%bitsPerDigit,g=bitsPerDigit-n,s=e.digits.length-1,d=s-1;s>0;--s,--d)e.digits[s]=e.digits[s]<<n&maxDigitVal|(e.digits[d]&highBitMasks[n])>>>g;return e.digits[0]=e.digits[s]<<n&maxDigitVal,e.isNeg=i.isNeg,e}
function biShiftRight(i,t){var r=Math.floor(t/bitsPerDigit),e=new BigInt;arrayCopy(i.digits,r,e.digits,0,i.digits.length-r);for(var n=t%bitsPerDigit,g=bitsPerDigit-n,s=0,d=s+1;s<e.digits.length-1;++s,++d)e.digits[s]=e.digits[s]>>>n|(e.digits[d]&lowBitMasks[n])<<g;return e.digits[e.digits.length-1]>>>=n,e.isNeg=i.isNeg,e}
function biMultiplyByRadixPower(i,t){var r=new BigInt;return arrayCopy(i.digits,0,r.digits,t,r.digits.length-t),r}
function biDivideByRadixPower(i,t){var r=new BigInt;return arrayCopy(i.digits,t,r.digits,0,r.digits.length-t),r}
function biModuloByRadixPower(i,t){var r=new BigInt;return arrayCopy(i.digits,0,r.digits,0,t),r}
function biCompare(i,t){if(i.isNeg!=t.isNeg)return 1-2*Number(i.isNeg);for(var r=i.digits.length-1;r>=0;--r)if(i.digits[r]!=t.digits[r])return i.isNeg?1-2*Number(i.digits[r]>t.digits[r]):1-2*Number(i.digits[r]<t.digits[r]);return 0}
function biDivideModulo(i,t){var r,e,n=biNumBits(i),g=biNumBits(t),s=t.isNeg;if(n<g)return i.isNeg?(r=biCopy(bigOne),r.isNeg=!t.isNeg,i.isNeg=!1,t.isNeg=!1,e=biSubtract(t,i),i.isNeg=!0,t.isNeg=s):(r=new BigInt,e=biCopy(i)),new Array(r,e);r=new BigInt,e=i;for(var d=Math.ceil(g/bitsPerDigit)-1,o=0;t.digits[d]<biHalfRadix;)t=biShiftLeft(t,1),++o,++g,d=Math.ceil(g/bitsPerDigit)-1;e=biShiftLeft(e,o),n+=o;for(var a=Math.ceil(n/bitsPerDigit)-1,u=biMultiplyByRadixPower(t,a-d);biCompare(e,u)!=-1;)++r.digits[a-d],e=biSubtract(e,u);for(var b=a;b>d;--b){var l=b>=e.digits.length?0:e.digits[b],h=b-1>=e.digits.length?0:e.digits[b-1],f=b-2>=e.digits.length?0:e.digits[b-2],c=d>=t.digits.length?0:t.digits[d],m=d-1>=t.digits.length?0:t.digits[d-1];l==c?r.digits[b-d-1]=maxDigitVal:r.digits[b-d-1]=Math.floor((l*biRadix+h)/c);for(var x=r.digits[b-d-1]*(c*biRadix+m),v=l*biRadixSquared+(h*biRadix+f);x>v;)--r.digits[b-d-1],x=r.digits[b-d-1]*(c*biRadix|m),v=l*biRadix*biRadix+(h*biRadix+f);u=biMultiplyByRadixPower(t,b-d-1),e=biSubtract(e,biMultiplyDigit(u,r.digits[b-d-1])),e.isNeg&&(e=biAdd(e,u),--r.digits[b-d-1])}return e=biShiftRight(e,o),r.isNeg=i.isNeg!=s,i.isNeg&&(r=s?biAdd(r,bigOne):biSubtract(r,bigOne),t=biShiftRight(t,o),e=biSubtract(t,e)),0==e.digits[0]&&0==biHighIndex(e)&&(e.isNeg=!1),new Array(r,e)}
function biDivide(i,t){return biDivideModulo(i,t)[0]}
function RSAKeyPair(i,t,r,e){this.e=biFromHex(i),this.d=biFromHex(t),this.m=biFromHex(r),"number"!=typeof e?this.chunkSize=2*biHighIndex(this.m):this.chunkSize=e/8,this.radix=16,this.barrett=new BarrettMu(this.m)}
function encryptedString(i,t,r,e){var n,g,s,d,o,a,u,b,l,h,f=new Array,c=t.length,m="";for(d="string"==typeof r?r=='NoPadding'?1:r=='PKCS1Padding'?2:0:0,o="string"==typeof e&&e=='RawEncoding'?1:0,1==d?c>i.chunkSize&&(c=i.chunkSize):2==d&&c>i.chunkSize-11&&(c=i.chunkSize-11),n=0,g=2==d?c-1:i.chunkSize-1;n<c;)d?f[g]=t.charCodeAt(n):f[n]=t.charCodeAt(n),n++,g--;for(1==d&&(n=0),g=i.chunkSize-c%i.chunkSize;g>0;){if(2==d){for(a=Math.floor(256*Math.random());!a;)a=Math.floor(256*Math.random());f[n]=a}else f[n]=0;n++,g--}for(2==d&&(f[c]=0,f[i.chunkSize-2]=2,f[i.chunkSize-1]=0),u=f.length,n=0;n<u;n+=i.chunkSize){for(b=new BigInt,g=0,s=n;s<n+i.chunkSize;++g)b.digits[g]=f[s++],b.digits[g]+=f[s++]<<8;l=i.barrett.powMod(b,i.e),h=1==o?biToBytes(l):16==i.radix?biToHex(l):biToString(l,i.radix),m+=h}return m}

function _btoa (s) {
	var base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	if (/([^\u0000-\u00ff])/.test(s)) {
        throw new Error('INVALID_CHARACTER_ERR');
    }    
    var i = 0,prev,ascii,mod,result = [];
    while (i < s.length) {
        ascii = s.charCodeAt(i);
        mod = i % 3;
        switch(mod) {
            case 0:
                result.push(base64hash.charAt(ascii >> 2));
                break;
            case 1:
                result.push(base64hash.charAt((prev & 3) << 4 | (ascii >> 4)));
                break;
            case 2:
                result.push(base64hash.charAt((prev & 0x0f) << 2 | (ascii >> 6)));
                result.push(base64hash.charAt(ascii & 0x3f));
                break;
	    }
        prev = ascii;
        i ++;
    }
    if(mod == 0) {
        result.push(base64hash.charAt((prev & 3) << 4));
        result.push('==');
    } else if (mod == 1) {
        result.push(base64hash.charAt((prev & 0x0f) << 2));
        result.push('=');
    }
    return result.join('');
}

function encode_userinfo(key, code) {
	setMaxDigits(131);
	var c=new RSAKeyPair("3","10001",key,1024);
	t = _btoa(encryptedString(c,code,'PKCS1Padding','RawEncoding'));
	return t
}

// var key = 'D9018B6F217F234D321ECBA9006F8702B81385F0BB86A2B07298D1ECD0FD911CB24119614DFD09DF0688153445D626D54CDC73C17ACC6E51D03BD008B422C86636D4419E5AC146EB109A0A54B09CF5F8F086797BCAD35E8240FBF87D55657F4B231387B82157D5B1A0D80BF88A15D0EBB6F351527EBC9D7B0FA7D3AC2E429323';
// var code = '15002753208';
// encode_userinfo(key, code)
