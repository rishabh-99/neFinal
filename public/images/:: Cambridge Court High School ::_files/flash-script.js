/// JavaScript Document
function writeFlash(file,width,height)
{
document.write( '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '); 
document.write('codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" ');
document.write('width="'+width+'" height="'+height+'" id="buttons" align="absbottom">');
document.write('<param name="movie" value="'+file+'" />');
document.write('<param name="wmode" value="transparent" />');
document.write('<param name="quality" value="high" /> ');
document.write('<param name="menu" value="false" /> ');
document.write('<param name="bgcolor" value="#ffffff" /> ');
document.write('<embed src="'+file+'" wmode="transparent" menu=false bgcolor=#ffffff width="'+width+'" height="'+height+'" align="absbottom" quality="high" ');
document.write('pluginspage="http://www.macromedia.com/go/getflashplayer"  ');
document.write('type="application/x-shockwave-flash"></embed></object>');
}