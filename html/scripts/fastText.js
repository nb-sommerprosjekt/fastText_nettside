 f u n c t i o n   g e t C l a s s i f i c a t i o n L i n k ( )   { 
     v a r   u r l   =     d o c u m e n t . g e t E l e m e n t B y I d ( ' U R L _ f r o m _ u s e r ' ) . v a l u e ; 
     v a r   s e r v e r _ u r l   =   " h t t p : / / / / t e n s o r - 1 . n b . n o : 5 0 0 0 / r e s t _ l i n k / " ; 
     v a r   x h t t p   =   n e w   X M L H t t p R e q u e s t ( ) ; 
     v a r   r e s u l t = x h t t p . o p e n ( " P O S T " ,   s e r v e r _ u r l ,   f a l s e ) ; 
     x h t t p . s e t R e q u e s t H e a d e r ( " C o n t e n t - t y p e " , " a p p l i c a t i o n / j s o n " ) ; 
     c o n s o l e . l o g ( u r l ) ; 
     v a r   P D F b o o l   =     d o c u m e n t . g e t E l e m e n t B y I d ( ' P D F b o x ' ) . c h e c k e d ; 
     x h t t p . s e n d ( J S O N . s t r i n g i f y ( [ u r l , P D F b o o l ] ) ) ; 
     r e s u l t   =   x h t t p . r e s p o n s e T e x t ; 
     c o n s o l e . l o g ( P D F b o o l ) ; 
     r e s u l t = J S O N . p a r s e ( r e s u l t ) ; 
     a r t i c l e _ i d = r e s u l t [ 1 ] 
     r e s u l t = r e s u l t [ 0 ] 
     c o n s o l e . l o g ( r e s u l t ) ; 
     c o n s o l e . l o g ( t y p e o f   r e s u l t ) ; 
 
     i f   ( r e s u l t = = " N o e   g i k k   g a l t " ) { 
         p o s t E r r o r M e s s a g e ( " l i n k " ) ; 
     } 
     e l s e { 
         p o p u l a t e L i s t ( u r l , r e s u l t , a r t i c l e _ i d , " r e s u l t s " , " l i n k " ) ; 
     } 
 } 
 / / t e n s o r - 1 . n b . n o 
 f u n c t i o n   g e t C l a s s i f i c a t i o n T e x t ( ) { 
 
     v a r   t e x t   =     d o c u m e n t . g e t E l e m e n t B y I d ( ' t e x t _ f r o m _ u s e r ' ) . v a l u e ; 
     v a r   s e r v e r _ u r l   =   " h t t p : / / / / t e n s o r - 1 . n b . n o : 5 0 0 0 / r e s t _ t e x t / " ; 
     v a r   x h t t p   =   n e w   X M L H t t p R e q u e s t ( ) ; 
     v a r   r e s u l t = x h t t p . o p e n ( " P O S T " ,   s e r v e r _ u r l ,   f a l s e ) ; 
     x h t t p . s e t R e q u e s t H e a d e r ( " C o n t e n t - t y p e " , " a p p l i c a t i o n / j s o n " ) ; 
     c o n s o l e . l o g ( t e x t ) ; 
     x h t t p . s e n d ( J S O N . s t r i n g i f y ( t e x t ) ) ; 
     r e s u l t   =   x h t t p . r e s p o n s e T e x t ; 
     c o n s o l e . l o g ( r e s u l t ) ; 
     r e s u l t = J S O N . p a r s e ( r e s u l t ) ; 
     a r t i c l e _ i d = r e s u l t [ 1 ] 
     r e s u l t = r e s u l t [ 0 ] 
     c o n s o l e . l o g ( r e s u l t ) ; 
     c o n s o l e . l o g ( t y p e o f   r e s u l t ) ; 
     i f   ( r e s u l t = = " N o e   g i k k   g a l t " ) { 
         p o s t E r r o r M e s s a g e ( " t e x t " ) ; 
     } 
     e l s e { 
         p o p u l a t e L i s t ( t e x t , r e s u l t , a r t i c l e _ i d , " r e s u l t s " , " t e x t " ) ; 
     } 
 } 
 
 f u n c t i o n   s e n d F e e d b a c k ( f e e d b a c k ) { 
     c o n s o l e . l o g ( f e e d b a c k ) ; 
     v a r   s e r v e r _ u r l   =   " h t t p : / / / / t e n s o r - 1 . n b . n o : 5 0 0 0 / r e s t _ f e e d b a c k / " ; 
     v a r   x h t t p   =   n e w   X M L H t t p R e q u e s t ( ) ; 
     v a r   r e s u l t = x h t t p . o p e n ( " P O S T " ,   s e r v e r _ u r l ,   f a l s e ) ; 
     x h t t p . s e t R e q u e s t H e a d e r ( " C o n t e n t - t y p e " , " a p p l i c a t i o n / j s o n " ) ; 
     x h t t p . s e n d ( J S O N . s t r i n g i f y ( f e e d b a c k ) ) ; 
     r e s u l t   =   x h t t p . r e s p o n s e T e x t ; 
     c o n s o l e . l o g ( " F e e d b a c k   s e n t "   ) ; 
     v a r   r e s u l t L i s t = d o c u m e n t . g e t E l e m e n t B y I d ( " r e s u l t s " ) ; 
     r e s u l t L i s t = r e s u l t L i s t . c h i l d N o d e s [ 1 ] 
     c o n s o l e . l o g ( r e s u l t L i s t . c h i l d N o d e s ) 
     r e s u l t L i s t . r e m o v e C h i l d ( r e s u l t L i s t . c h i l d N o d e s [ r e s u l t L i s t . c h i l d N o d e s . l e n g t h - 1 ] ) ; 
     r e s u l t L i s t . a p p e n d C h i l d ( d o c u m e n t . c r e a t e T e x t N o d e ( " T a k k   f o r   t i l b a k e m e l d i n g e n ! " ) ) 
 } 
 
 
 
 f u n c t i o n   p o p u l a t e L i s t ( u r l , r e s u l t , a r t i c l e _ i d , i d _ n a m e , m e t h o d ) { 
     v a r   l i s t C o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( i d _ n a m e ) ; 
 
     v a r   n e w L i s t   =   d o c u m e n t . c r e a t e E l e m e n t ( " u l " ) ; 
     n e w L i s t . s e t A t t r i b u t e ( " i d " ,   " r e s u l t U L " ) ; 
 
 
     f o r ( v a r   i   =   0   ;   i   <   r e s u l t . l e n g t h   ;   i   + + ) 
     { 
 
         v a r   n e w L i s t I t e m   =   d o c u m e n t . c r e a t e E l e m e n t ( " l i " ) ; 
         v a r   p r o b a b i l i t y = p a r s e F l o a t ( r e s u l t [ i ] [ 1 ] ) ; 
         i f   ( 0 < = p r o b a b i l i t y   & &   p r o b a b i l i t y < 0 . 0 5 ) { 
             c o n t i n u e ; 
         } 
         v a r   p r o b a b i l i t y _ t e x t   = g e t P r o b a b i l i t y T e x t ( p r o b a b i l i t y ) 
 
         n e w L i s t I t e m . i n n e r H T M L   =   " D e w e y - n r :   < b > " + r e s u l t [ i ] [ 0 ]   +   " < / b >   e r   " + p r o b a b i l i t y _ t e x t   +   " .     K l a s s e b e t e g n e l s e n   e r   \ ' " + r e s u l t [ i ] [ 2 ] + " \ ' . " ; 
 
         n e w L i s t . a p p e n d C h i l d ( n e w L i s t I t e m ) ; 
 
     } 
     i f   ( n e w L i s t . c h i l d E l e m e n t C o u n t   ! = 0 ) { 
         l i s t C o n t a i n e r . i n s e r t B e f o r e ( n e w L i s t ,   l i s t C o n t a i n e r . c h i l d N o d e s [ 0 ] ) ; 
     } 
     e l s e { 
         v a r   f e i l m e l d i n g = d o c u m e n t . c r e a t e T e x t N o d e ( " B e k l a g e r ,   m e n   d e t   v a r   i n g e n   d e w e y - n r   s o m   e r   s p e s i e l t   s a n n s y n l i g e . " ) 
         l i s t C o n t a i n e r . i n s e r t B e f o r e ( f e i l m e l d i n g ,   l i s t C o n t a i n e r . c h i l d N o d e s [ 0 ] ) ; 
     } 
 
     v a r   h e a d e r   =   d o c u m e n t . c r e a t e E l e m e n t ( " h 2 " ) 
     i f   ( m e t h o d = = " l i n k " ) { 
         v a r   p a r a g r a p h =   d o c u m e n t . c r e a t e T e x t N o d e ( " H e r   e r   r e s u l t a t e t   f r a :   " + u r l ) 
     } 
     e l s e { 
         v a r   p a r a g r a p h =   d o c u m e n t . c r e a t e T e x t N o d e ( " H e r   e r   r e s u l t a t e t   f r a   k l a s s i f i s e r i n g e n :   " ) 
     } 
     h e a d e r . a p p e n d C h i l d ( p a r a g r a p h ) ; 
     l i s t C o n t a i n e r . i n s e r t B e f o r e ( h e a d e r ,   l i s t C o n t a i n e r . c h i l d N o d e s [ 0 ] ) ; 
     v a r   f e e d b a c k B u t t o n s =   c r e a t e F e e d b a c k B u t t o n s ( a r t i c l e _ i d )     
     n e w L i s t . a p p e n d C h i l d ( f e e d b a c k B u t t o n s ) 
 
 } 
 
 f u n c t i o n   g e t P r o b a b i l i t y T e x t ( p r o b a b i l i t y ) { 
     v a r   p r o b a b i l i t y _ t e x t   = " " 
 
     i f   ( 0 . 0 5 < = p r o b a b i l i t y   & &   p r o b a b i l i t y < 0 . 2 5 ) { 
         p r o b a b i l i t y _ t e x t = " m i n d r e   s a n n s y n l i g " 
     } 
     e l s e   i f   ( 0 . 2 5 < = p r o b a b i l i t y   & &   p r o b a b i l i t y < 0 . 5 0 ) { 
         p r o b a b i l i t y _ t e x t = " l i t t   s a n n s y n l i g " 
     } 
     e l s e   i f   ( 0 . 5 0 < = p r o b a b i l i t y   & &   p r o b a b i l i t y < 0 . 7 5 ) { 
         p r o b a b i l i t y _ t e x t = " g a n s k e   s a n n s y n l i g " 
     } 
     e l s e   i f   ( 0 . 7 5 < = p r o b a b i l i t y   & &   p r o b a b i l i t y < = 1 . 0 ) { 
         p r o b a b i l i t y _ t e x t = " s v � r t   S a n n s y n l i g " 
     } 
     r e t u r n   p r o b a b i l i t y _ t e x t 
 
 } 
 f u n c t i o n   p o s t E r r o r M e s s a g e ( m e t h o d ) { 
     v a r   l i s t C o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( " r e s u l t s " ) ; 
     v a r   h e a d e r   =   d o c u m e n t . c r e a t e E l e m e n t ( " h 2 " ) 
     h e a d e r . s e t A t t r i b u t e ( " i d " ,   " f a i l u r e H 2 " ) ; 
     i f   ( m e t h o d = = " l i n k " ) { 
         v a r   p a r a g r a p h =   d o c u m e n t . c r e a t e T e x t N o d e ( " N o e   g i k k   g a l t   u n d e r   k l a s s i f i s e r i n g e n .   D e t   k a n   v � r e   n o e   g a l t   m e d   l i n k e n   s o m   d u   s e n d t e   i n n .   P a s s   p � .   O m   d u   e r   s i k k e r   p �   a t   d u   h a r   f u l g t   k r a v e n e   o v e r ,   k a n   d e t   v � r e   n o e   f e i l   m e d   s e r v e r e n .   V e n n l i g s t   t a   k o n t a k t   m e d   ' s o m m e r v i k a r e n e '   o m   p r o b l e m e t   v e d v a r e r . " ) ; 
     } 
     e l s e   i f ( m e t h o d = = " t e x t " ) { 
         v a r   p a r a g r a p h =   d o c u m e n t . c r e a t e T e x t N o d e ( " N o e   g i k k   g a l t   u n d e r   k l a s s i f i s e r i n g e n .   T e k s t e n   m �   v � r e   n o r s k .   O m   d u   e r   s i k k e r   p �   a t   d u   h a r   f u l g t   k r a v e n e   o v e r ,   k a n   d e t   v � r e   n o e   f e i l   m e d   s e r v e r e n .   V e n n l i g s t   t a   k o n t a k t   m e d   ' s o m m e r v i k a r e n e '   o m   p r o b l e m e t   v e d v a r e r . " ) ; 
     } 
     e l s e { 
         v a r   p a r a g r a p h =   d o c u m e n t . c r e a t e T e x t N o d e ( " N o e   g i k k   g a l t   u n d e r   k l a s s i f i s e r i n g e n . " ) ; 
     } 
     h e a d e r . a p p e n d C h i l d ( p a r a g r a p h ) ; 
     l i s t C o n t a i n e r . i n s e r t B e f o r e ( h e a d e r ,   l i s t C o n t a i n e r . c h i l d N o d e s [ 0 ] ) ; 
 } 
 
 
 f u n c t i o n   c r e a t e F e e d b a c k B u t t o n s ( a r t i c l e _ i d ) { 
     v a r   n e w L i s t   =   d o c u m e n t . c r e a t e E l e m e n t ( " u l " ) ; 
     n e w L i s t . s e t A t t r i b u t e ( " i d " , " c r e a t e F e e d b a c k B u t t o n s " ) ; 
     n e w L i s t . a p p e n d C h i l d ( c r e a t e B u t t o n ( " G o d " , a r t i c l e _ i d ) ) ; 
     n e w L i s t . a p p e n d C h i l d ( c r e a t e B u t t o n ( " M i d d e l s " , a r t i c l e _ i d ) ) ; 
     n e w L i s t . a p p e n d C h i l d ( c r e a t e B u t t o n ( " D � r l i g " , a r t i c l e _ i d ) ) ; 
     r e t u r n   n e w L i s t ; 
 } 
 
 f u n c t i o n   c r e a t e B u t t o n ( f e e d b a c k , a r t i c l e _ i d ) { 
     v a r   b u t t o n   = d o c u m e n t . c r e a t e E l e m e n t ( " b u t t o n " ) ; 
     b u t t o n . v a l u e   =   [ f e e d b a c k , a r t i c l e _ i d ] ; 
     b u t t o n . o n c l i c k   =   f u n c t i o n ( ) { s e n d F e e d b a c k ( b u t t o n . v a l u e ) ; } 
 
     v a r   t   =   d o c u m e n t . c r e a t e T e x t N o d e ( f e e d b a c k ) ; 
     b u t t o n . a p p e n d C h i l d ( t ) ; 
 
     r e t u r n   b u t t o n ; 
 } 
 
