#pragma strict
import System.Collections.Generic;

//-----TABLE OF CONTENTS-----
//1. VARIABLES / CLASSES
//2. TOOL FUNCTIONS
//3. P1 FUNCTIONS
//4. P2 FUNCTIONS
//5. MAIN FUCTIONS
//6. GUI FUNCTIONS


//************************** VARIABLES / CLASSES **************************
//************************** VARIABLES / CLASSES **************************

//Variables to access other scripts.

//Variable to access and destroy battle scene.
var explode : GameObject;
explode = GameObject.Find("Fight");

//Access script LaserCreate;
var laser : GameObject;
laser = GameObject.Find("laser");
var laserCreate : LaserCreate;
laserCreate = laser.GetComponent("LaserCreate");

//Global variables for players and their associated varibales.
var p1 : List.<Card>; //P1 cards: shuffled.
var p2 : List.<Card>; //P2 cards.
var p1Show : List.<Card>; //P1 cards in hand.
var p2Show : List.<Card>; //P2 cards in hand.
var p1Choice : List.<Card>; //Cards p1 chooses.
var cardChoice = new ArrayList(); //Var.cardChoice used for sorting p1's choices for deletion of p1Show.
var p2Choice : List.<Card>; //Cards p2 chooses.
var p2AddCard : List.<Card>; //List of other cards in p2 hand. p2Choice + p2AddCard = p2Show
var p1Score : float = 0; //Score assigned to p1's hand.
var p2Score : float = 0; //Score assigned to p2's hand.
var choiceActive : boolean; //Switch that turns on/off player's input.
var p1Life : float;//P1 life. Starts at 100.
var p2Life : float;//P2 life. Starts at 100.
var p1AttPwr : float = 1.25;//P1 attack power.
var p2AttPwr : float = 1.10;//P2 attack power.
var timerStart : float = 10; //Gives timer the starting value of 10.
var timer : float; //Timer for counting down.
var reshuffleDisp : boolean;
var box : Texture2D;
var timerStyle : GUIStyle;
var p1ValidChoice = new boolean [5];

//Enum for several variables.
enum LaserColor {Green, Blue, Red} //enum for laser color.
enum SuitIcon {D, C, H, S} //enum for suit of card.
enum ItemEffect {Shield, AddAtk};

//Class ItemBattle : Class variable that stores item's name, and effect.
class Item {
	var name : String;
	var effect : ItemEffect;
	//Constructor
	function Item (n : String, e : ItemEffect) {
		name = n;
		effect = e;
	}
}

//Class Card: Class variable that stores suit and number.
class Card {
    var suit : SuitIcon;
    var num : int;
	// Constructor that gives each card its number (num) and suit (suit) properities.
    function Card (s : SuitIcon , n : int) {
       suit = s;
       num = n;
    }
}

//GUI variables
var p1Num = new ArrayList(); //Array that stores p1 card's number.
var p1Suit = new ArrayList(); //Array that stores p1 card's suit.
var p2Num = new ArrayList(); //Array that stores p2 card's number.
var p2Suit = new ArrayList(); //Array that stores p2 card's suit.
var scrWidth : float; //Variable for the resolution of screen's width.
var scrHeight : float; //Variable for the resolution of screen's Height.
var cHeight : float; //Height of cards.
var cWidth : float; //Width of cards.
var eWidth : float; //Width of the ends of group of p1 or 
var sWidth : float; //Width of spaces between cards.
var bWidth : float; //Width of box. Look in function Awake for formula.
var lifeHeight : float; //Height of life bar
var bHeight : float; //Height of box. Look in function Awake for formula
var bPosX : float; //Starting position of box.
var guiBattle : GUISkin;
var timerWidth : float;
var timerHeight: float;
var lifeBg : Texture2D;
var lifeBar : Texture2D;
var dmgBar : Texture2D;
var guiSwitch : boolean;
var validChoiceHeight : float;
var validChoiceBG : Texture2D;
var cardD : Texture2D;
var cardC : Texture2D;
var cardH : Texture2D;
var cardS : Texture2D;

//*************************** TOOL FUNCTIONS ***************************
//*************************** TOOL FUNCTIONS ***************************

//Randomly gives the card (the argument) to p1 or p2.
function PassCard (card : Card) {
    if (Random.value <= .5) {
    	if (p1.Count < 20) {
        	p1.Add(card);
        }
        else {
        	p2.Add(card);
        }
    }
    else {
    	if (p2.Count < 20) {
        	p2.Add(card);
        }
        else {
        	p1.Add(card);
    	}
    }
}

//Function that does insertion sort for ArrayList types.
function InsertSort (inspList : ArrayList) {
	var inspAmt : int = inspList.Count; // Number of items in the array.
    var v : int; // The value currently being compared.
    for (var i=1; i < inspAmt; i++) {
    	v = inspList[i];
    	var k : int = inspList[i-1];
    	for (var j=i-1; j > -1 && k > v; j--) {
            inspList[j+1] = inspList[j];
            if (j>0)
            	k = inspList[j-1];
        }
        inspList [j+1] = v;
    }
    return inspList;
}

//Function that does insertion sort for Generic List types types.
function InsertSort (inspList : List.<Card>) {
	var inspAmt : int = inspList.Count; // Number of items in the list.
    var v : int; // The value currently being compared.
    for (var i=1; i<inspAmt; i++) {
    	v = inspList[i].num; // The value currently being compared.
    	var subSuit : SuitIcon = inspList[i].suit;//Create duplicate of suit property of Generic List's index at i...
		var subNum : int = inspList[i].num;  //Create duplicate of num property of Generic List's index at i...
		var vCard = new Card (subSuit, subNum);//Creates new Card class variable card...
    	var k : int = inspList[i-1].num;
    	for (var j=i-1; j>=0 && k>v; j--) {
            inspList[j+1] = inspList[j];
            if (j>0)
            	k = inspList[j-1].num;
        }
        inspList[j+1] = vCard;
    }
    return inspList;
}


//***************************** P1 FUNCTIONS *****************************
//***************************** P1 FUNCTIONS *****************************

//Gives 5 random cards from p1's deck to his hand (p1Show).
function P1ShowHand () {
	print ("p1Show length: " + p1Show.Count);
	print ("p1 deck length: " + p1.Count);
	var p1Lgt : int = 5 - p1Show.Count; //Set's length of deck for the for loop below.
	print ("P1's hand length: " + p1Show.Count + " | P1's deck length: " + p1.Count + " | Cards needed: " + p1Lgt); //For my OCD debug purposes.
	//For loop chooses a random card from 0 to the last card in the deck.
	for (var i=0; i<p1Lgt; i++) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p1.Count)); //rdmCard = A random number between 0 and the length of the array.
		p1Show.Add (p1[rdmCard]);	
		p1.RemoveAt(rdmCard);
	}
	//Shows p1 hand through GUI (function ShowCards).
	ShowCard (1, p1Show);
	p1Choice.Clear();
	cardChoice.Clear();
	choiceActive = true;
	timer = timerStart;
	print ("choiceActive: " + choiceActive);
	print ("Timer: " + timer);
	p1Choice.Clear();
}

//Debug: Randomly chooses 3 cards from p1Show to see if pairs matches. In the end, the check p1 choices for hand.
function P1InputWindow (choiceActive : boolean) {
	//!!!DEBUG: Randomly chooses 3 cards.  REPLACE this with p1 input.!!!
	if (choiceActive) {
		if (Input.GetKeyUp (KeyCode.Keypad1) || Input.GetKeyUp (KeyCode.Alpha1)) {
			if (p1ValidChoice[0]) {
				print ("Num1 was released");
				var subSuit : SuitIcon = p1Show[0].suit;//Create duplicate of suit property of p1Show's index at 1...
				var subNum : int = p1Show[0].num;  //Create duplicate of num property of p1Show's index at 1...
				var card = new Card (subSuit, subNum);//Creates new Card class variable card...
				p1Choice.Add(card);//Adds new card to p1Choice.
				cardChoice.Add(0);//Adds p1Inuput for insertion sort and deletion from p1Show.
				ValidateChoice (0);
			}
		}
		else if (Input.GetKeyUp (KeyCode.Keypad2) || Input.GetKeyUp (KeyCode.Alpha2)) {
			if (p1ValidChoice[1]) {
				print ("Num2 was released");
				subSuit = p1Show[1].suit;//Create duplicate of suit property of p1Show's index at 2...
				subNum = p1Show[1].num;  //Create duplicate of num property of p1Show's index at 2...
				card = new Card (subSuit, subNum);//Creates new Card class variable card...
				p1Choice.Add(card);//Adds new card to p1Choice.
				cardChoice.Add(1);//Adds p1Inuput for insertion sort and deletion from p1Show.
				ValidateChoice (1);
			}
		}
		else if (Input.GetKeyUp (KeyCode.Keypad3) || Input.GetKeyUp (KeyCode.Alpha3)) {
			if (p1ValidChoice[2]) {
				print ("Num3 was released");
				subSuit = p1Show[2].suit;//Create duplicate of suit property of p1Show's index at 3...
				subNum = p1Show[2].num;  //Create duplicate of num property of p1Show's index at 3...
				card = new Card (subSuit, subNum);//Creates new Card class variable card...
				p1Choice.Add(card);//Adds new card to p1Choice.
				cardChoice.Add(2);//Adds p1Inuput for insertion sort and deletion from p1Show.
				ValidateChoice (2);
			}
		}
		else if (Input.GetKeyUp (KeyCode.Keypad4) || Input.GetKeyUp (KeyCode.Alpha4)) {
			if (p1ValidChoice[3]) {
				print ("Num4 was released");
				subSuit = p1Show[3].suit;//Create duplicate of suit property of p1Show's index at 4...
				subNum = p1Show[3].num;  //Create duplicate of num property of p1Show's index at 4...
				card = new Card (subSuit, subNum);//Creates new Card class variable card...
				p1Choice.Add(card);//Adds new card to p1Choice.
				cardChoice.Add(3);//Adds p1Inuput for insertion sort and deletion from p1Show.
				ValidateChoice (3);
			}
		}
		else if (Input.GetKeyUp (KeyCode.Keypad5) || Input.GetKeyUp (KeyCode.Alpha5)) {
			if (p1ValidChoice[4]) {
				print ("Num5 was released");
				subSuit = p1Show[4].suit;//Create duplicate of suit property of p1Show's index at 5...
				subNum = p1Show[4].num;  //Create duplicate of num property of p1Show's index at 5...
				card = new Card (subSuit, subNum);//Creates new Card class variable card...
				p1Choice.Add(card);//Adds new card to p1Choice.
				cardChoice.Add(4);//Adds p1Inuput for insertion sort and deletion from p1Show.
				ValidateChoice (4);
			}
		}
		if (p1Choice.Count >= 3)
			choiceActive = false;
//			P1CheckHand ();
	}
}

function P1CheckHand () {
	print ("choiceActive: " + choiceActive);
	if (p1Choice.Count < 3) {
		print ("p1 no choice.  Choosing random cards in p1Show");
		cardChoice.Clear();
		var choices = new Array(0, 1, 2, 3, 4);
		for (var i=0; i<3; i++) {
			var choiceNum : int = Mathf.RoundToInt (Random.Range (0, choices.length));
			var p1Input : int = choices[choiceNum]; //rdmCard = A random number between 0 and the length of p1Show array.
			var subSuit : SuitIcon = p1Show[p1Input].suit;//Create duplicate of suit property of p1Show's index at i.
			var subNum : int = p1Show[p1Input].num;  //Create duplicate of num property of p1Show's index at i.
			var card = new Card (subSuit, subNum);//Creates new Card class variable card.
			p1Choice.Add(card);//Adds new card to p1Choice.
			cardChoice.Add(p1Input);//Adds p1Inuput for insertion sort and deletion from p1Show.
			print ("P1's " + (i+1) + " | Number chosen: " + cardChoice[i] + " | Card chosen: " + p1Choice[i].suit + "" + p1Choice[i].num);
			choices.splice(choiceNum, 1); //Removes number chosen for var.choices array.
		}
	}
	cardChoice = InsertSort(cardChoice); //Re-Sorts (function InsertSort) p1 inputs (cardChoice-Array).
	//Deletes p1Choice from p1Show.
	Debug.Log("cardChoice.Count: " + cardChoice.Count + " | cardChoice Itms: " + cardChoice[0] + ", " + cardChoice[1] + ", " + cardChoice[2]);
	for (i=2; i>=0 ; i--) {
		var remNum : int = cardChoice[i];
		p1Show.RemoveAt(remNum); 
	}
	print ("Hand length after deletion: " + p1Show.Count);
	p1Choice = InsertSort(p1Choice);
	for (i=0; i<p1Choice.Count; i++) {
		print ("Card choice " + i + ": " + p1Choice[i].suit + "" + p1Choice[i].num);
	}
	//Check hands.
	p1Score = 0;
	CheckThreeKind ();
	if (p1Score == 0)
		CheckStraightFlush ();
	if (p1Score == 0)
		CheckFlush ();
	if (p1Score == 0)
		CheckStraight ();
	if (p1Score == 0) {
		CheckPair ();
		if (p1Score == 0) {
			var highNum : int = p1Choice[2].num;
			p1Score = 10 + highNum;
			print ("HIGH CARD | Score :" + p1Score);
		}
	}
	RoundEnd ();
}

//Checks p1 hand for 3 of a Kind.
function CheckThreeKind () {
	//Items in checkArray is given the value of p1Choice num property.
	var checkArray = new ArrayList();
	for (var i=0; i<3; i++) {
		var cardNum : int = p1Choice[i].num;
		checkArray.Add(cardNum);
		//print ("Num added " + checkArray[i]);
	}
	if (checkArray[0] == checkArray[1] && checkArray[1] == checkArray[2] && checkArray[0] == checkArray[2]) {
		var addToScore : int = checkArray[2];
		p1Score = 50 + addToScore;
		print ("3 OF A KIND | Score: " + p1Score);
	}
	else {
		print ("No 3 OF A KIND");
	}
}

//Checks p1 hand for PAIR.
function CheckPair () {
	//Items in checkArray is given the value of p1Choice num property.
	var checkArray = new ArrayList();
	for (var i=0; i<3; i++) {
		var cardNum : int = p1Choice[i].num;
		checkArray.Add(cardNum);
		//print ("Num added " + checkArray[i]);
	}
	if (checkArray[1] == checkArray[2] || checkArray[0] == checkArray[2]) {
		var addToScore : int = checkArray[2];
		p1Score = 20 + addToScore;
		print ("PAIR | Score: " + p1Score);
	}
	else if (checkArray[0] == checkArray[1]) {
		addToScore = checkArray[1];
		p1Score = 20 + addToScore;
		print ("PAIR | Score: " + p1Score);
	}
	else {
		print ("No PAIR");
	}
}

//Checks p1 hand for STRAIGHT.
function CheckStraight () {
	//Items in checkArray is given the value of p1Choice num property.
	var highNum : int = p1Choice[2].num;
	var midNum : int = p1Choice[1].num;
	var lowNum : int = p1Choice[0].num;
	if (highNum==midNum+1 && midNum==lowNum+1) {
		p1Score = 30 + highNum;
		print ("STRAIGHT | Score: " + p1Score);
	}
	else {
		print ("No STRAIGHT");
	}
}

//Checks p1 hand for FLUSH.
function CheckFlush () {
	var checkArray = new ArrayList(); //Items in checkArray is given the value of p1Choice num property.
	for (var i=0; i<3; i++) {
		var cardSuit : SuitIcon = p1Choice[i].suit;
		checkArray.Add(cardSuit);
	}
	if (checkArray[2]==checkArray[1] && checkArray[1]==checkArray[0]) {
		var addToScore : int = checkArray[2];
		p1Score = 40 + addToScore;
		print ("FLUSH | Score: " + p1Score);
	}
	else {
		print ("No FLUSH");
	}
}

//Checks p1 hand for STRAIGHTFLUSH.
function CheckStraightFlush () {
	//Items in checkArray is given the value of p1Choice num property.
	var highNum : int = p1Choice[2].num;
	var midNum : int = p1Choice[1].num;
	var lowNum : int = p1Choice[0].num;
	var highSuit : int = p1Choice[2].suit;
	var midSuit : int = p1Choice[1].suit;
	var lowSuit : int = p1Choice[0].suit;
	if (highNum==midNum+1 && midNum==lowNum+1 && lowSuit==midSuit && midSuit==highSuit ) {
		p1Score = 70 + highNum;
		print ("STRAIGHT FLUSH | Score: " + p1Score);
	}
	else {
		print ("No STRAIGHT FLUSH");
	}
}


//***************************** P2 FUNCTIONS *****************************
//***************************** P2 FUNCTIONS *****************************

// Decides order to check hands. Max of 20 items in ArrayList.
function P2FindHand () {
	print ("p1.Count: " + p1.Count + " | p2.Count: " + p2.Count + " | p1Show.Count: " + p1Show.Count + " | p2Show.Count: " + p2Show.Count);
	if (p1.Count <= 5) {
		print ("No cards. Reshuffling deck");
		Shuffle ();
	}
	else {
		var handProb = new ArrayList (); //Creates array to store probabilities.
		handProb.Add(1);//HIGHCARD (0) probability (out of 20).
		handProb.Add(8);//PAIR (1) probability (out of 20).
		handProb.Add(4);//STRAIGHT (2) probability (out of 20).
		handProb.Add(3);//FLUSH (3) probability (out of 20).
		handProb.Add(2);//3KIND (4) probability (out of 20).
		handProb.Add(1);//STRAIGHTFLUSH (5) probability (out of 20).
		handProb.Add(1);//ROYALFLUSH (6) probability (out of 20).
		var p2Check = new ArrayList (); //Var.p2Check creates array for probabilities to check hands.
		for (var i=0; i<7; i++){
			var cycleProb : int = handProb[i];
			for (var j=0; j<cycleProb; j++) {
				p2Check.Add(i);
			}
		}
		p2Score = 0;
		while (p2Score == 0) {
			var rdmHand : int = Mathf.RoundToInt (Random.Range (0, p2Check.Count)); //rdmCard = A random number between 0 and the length of the array.
//			p2Check[rdmHand] = 5; //!!!DEBUG. TO OVERRIDE RANDOM CHOICE.
			print("Random hand chosen to check: " + rdmHand);
			if (p2Check[rdmHand] == 0)
				p2Score = MakeHighCard ();
			else if (p2Check[rdmHand] == 1)
				p2Score = MakePair ();
			else if (p2Check[rdmHand] == 2)
				p2Score = MakeStraight ();
			else if (p2Check[rdmHand] == 3)
				p2Score = MakeFlush ();
			else if (p2Check[rdmHand] == 4)
				p2Score = MakeThreeKind ();
			else if (p2Check[rdmHand] == 5) {
				print ("StraightFlush not done");
//				p2Score = MakeStraightFlush ();
			}
			else if (p2Check[rdmHand] == 6) {
				print ("P2? ROYAL FLUSH (not done)");
				//p2Score = MakeRoyalFlush ();
			}
			if (p2Score == 0) {
				for (i=0; i<p2Check.Count; i++) {
					if (p2Check[i] == rdmHand) {
						print ("Deleting p2 probabilities for: " + p2Check[i]);
						p2Check.RemoveAt(i);
					}
				}
			}
		}
		P2AddHand ();
		print ("P2 score: " + p2Score);
		print ("p2Show size: " + p2Show.Count);
		ShowCard (2, p2Show); //Sends p2Show to GUI.
		p2Choice.Clear();
		p2Show.Clear();
		P1ShowHand ();
	}		
}

//function P2AddHand adds two cards to p2Show to 
function P2AddHand () {
	p2Show.Clear();
	print ("p2AddCard.Count: " + p2AddCard.Count + " | p2Choice.Count: " + p2Choice.Count);
	if (p2AddCard.Count != 0) {  //Determines if p2Choice card is also p2AddCard card.  If so, program will delete p2AddCard.
		for (var i=0; i<p2Choice.Count && p2AddCard.Count>0; i++) {
			for (var j=0; j<p2AddCard.Count; j++) {
				print ("p2Choice: " + p2Choice[i].suit + "" + p2Choice[i].num + " | p2AddCard: " + p2AddCard[j].suit + "" +  p2AddCard[j].num);
				if (p2Choice[i].num == p2AddCard[j].num && p2Choice[i].suit == p2AddCard[j].suit) {
					print ("Removing p2AddCard: " + p2AddCard[j].suit + "" +  p2AddCard[j].num);
					p2AddCard.RemoveAt(j);
					j--;//Subtract 1 from var.j, to keep up with the rising increment.
				}
			}
		}
	}
	print ("p2AddCard.Count after duplication check: " + p2AddCard.Count);
	while (p2AddCard.Count < 2) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p2.Count));//Randomly chooses card in p2 deck.
		if (rdmCard >= p2.Count)
			rdmCard--;
		var subSuit : SuitIcon = p2[rdmCard].suit; //Create duplicate of suit property of p1Show's index at i.
		var subNum : int = p2[rdmCard].num;  //Create duplicate of num property of p1Show's index at i.
		var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        p2AddCard.Add(card); //Adds new card to p2AddCard.
	}
//Next 2 for loops combines p2Choice and p2AddCard to make p2Show.
	for (i=0; i<p2Choice.Count; i++) {
		subSuit = p2Choice[i].suit; //Create duplicate of suit property of p1Show's index at i.
		subNum = p2Choice[i].num;  //Create duplicate of num property of p1Show's index at i.
		card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
		p2Show.Add (card);
	}
	for (i=0; i<p2AddCard.Count; i++) {
		subSuit = p2AddCard[i].suit; //Create duplicate of suit property of p1Show's index at i.
		subNum = p2AddCard[i].num;  //Create duplicate of num property of p1Show's index at i.
		card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
		p2Show.Add (card);
		print ("Card to add: " + subSuit + "" + subNum);
	}
	for (i=0; i<p2Show.Count; i++)
    	print ("p2Show index: " + i + " | card: " + p2Show[i].suit + "" + p2Show[i].num);
}

//Checks p2 deck to see if it has a HIGH CARD.
function MakeHighCard () {
	print ("P2: HIGHCARD?");
	var localScore: int = 0;
	for (var i=0; i<3; i++) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p2.Count));//Randomly chooses card in p2 deck.
		if (rdmCard >= p2.Count)
			rdmCard--;
		var subSuit : SuitIcon = p2[rdmCard].suit; //Create duplicate of suit property of p1Show's index at i.
		var subNum : int = p2[rdmCard].num;  //Create duplicate of num property of p1Show's index at i.
		var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        p2Choice.Add(card); //Adds new card to p2Choice.
        //card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Show.
        p2Show.Add(card); //Adds new card to p2Show."p2AddCard.Count: " + p2AddCard.Count
		p2.RemoveAt(rdmCard);//Adds p1Inuput for insertion sort and deletion from p1Show.
	}
	p2Choice = InsertSort(p2Choice);//Sorted the three chosen random cards.
	localScore = 10 + p2Choice[2].num;
	print ("Score for HIGHCARD: " + localScore);
	return localScore;
}

//Checks p2 deck to see if it has a PAIR.
function MakePair () {
	print ("P2: PAIR?");
	var localScore: int = 0; //Create localScore to return to P2FindHand
	for (var i=0; i<2 && localScore==0; i++) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p2.Count)); //Randomly chooses card to start checking down the deck for a pair.
		if (rdmCard >= p2.Count)
			rdmCard--;
		else if (rdmCard <= 0)
			rdmCard ++;
		print ("Random number: " + rdmCard + " | P2 deck size: " + p2.Count);
		for (var j=rdmCard; j>0 && localScore==0; j--) {
			print ("Check number index: " + j + " | Pair number chosen: " + p2[j].num + " and " + p2[j - 1].num);
			if (p2[j].num == p2[j - 1].num) {
				print ("PAIR! Checked inside function");
				for (var k=0; k<2; k++) { //for loop adds cards to p2Choice.
					var subSuit : SuitIcon = p2[j-k].suit; //Create duplicate of suit property of p1Show's index at i.
					var subNum : int = p2[j-k].num;  //Create duplicate of num property of p1Show's index at i.
					var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        			p2Choice.Add(card); //Adds new card to p2Choice.
        			p2.RemoveAt(j-k); //Removing card at location of pair chosen.
        			print ("Number chosen: " + (j-k) + " | Cards chosen: " + p2Choice[k].suit + "" + p2Choice[k].num);
        		}
        		var addScore : int = p2Choice[0].num; //Highest number in p2Choice. Above for loop added the highest card first.
        		localScore = 20 + addScore; //Adds 20 (for pair) and highest number in p2Choice
        		//Randomly chooses card to add to pair.
        		rdmCard = Mathf.RoundToInt (Random.Range (0, p2.Count)); 
        		if (rdmCard >= p2.Count)
					rdmCard--;
        		subSuit = p2[rdmCard].suit; //Create duplicate of suit property of p1Show's index at i.
				subNum = p2[rdmCard].num;  //Create duplicate of num property of p1Show's index at i.
				card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        		p2Choice.Add(card); //Adds new card to p2Choice.
        		print ("Random card chosen to add to pair: " + p2Choice[2].suit + "" + p2Choice[2].num);
        		p2.RemoveAt(rdmCard); //Removing card at rdmCard's index.
        		print ("Score for PAIR: " + localScore);
				return localScore;
			}
		}
    }
    return localScore;
}

//Checks p2 deck to see if it has a STRAIGHT.
function MakeStraight () {
	print ("P2: STRAIGHT?");
	var localScore: int = 0; //Create localScore to return to P2FindHand
	for (var i=0; i<2 && localScore==0; i++) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p2.Count)); //Randomly chooses card to start checking down the deck for a pair.
		if (rdmCard >= p2.Count) //Makes sure rdmCard only goes to last
			rdmCard--;
		else if (rdmCard <= 0)
			rdmCard ++;
		var checkArray = new ArrayList();
		print ("Random number: " + rdmCard + " | P2 deck size: " + p2.Count);
		checkArray.Add(rdmCard);
		var scrollNum: int = rdmCard; //Assigns card to check.  Starts with the random card chosen.
		var highNum : int = p2[scrollNum].num;
		var midNum : int = p2[scrollNum].num;
		var lowNum : int;
		while (midNum == highNum && scrollNum > 1) {
			scrollNum--;
			midNum = p2[scrollNum].num;
		}
		if (midNum == (highNum - 1)) {
			checkArray.Add(scrollNum);
			lowNum = p2[scrollNum].num;;
			while (lowNum == midNum && scrollNum > 0) {
				scrollNum--;
				lowNum = p2[scrollNum].num;
			}
			if (lowNum == (midNum - 1)) {
				checkArray.Add(scrollNum);
				localScore = 30 + highNum;
				for (var j=0; j<3; j++) {
					var addCard : int = checkArray[j];
					var subSuit : SuitIcon = p2[addCard].suit; //Create duplicate of suit property of p1Show's index at i.
					var subNum : int = p2[addCard].num;  //Create duplicate of num property of p1Show's index at i.
					var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        			p2Choice.Add(card); //Adds new card to p2Choice.
        			p2.RemoveAt(addCard);
        			print("Index of card chosen for Straight " + checkArray[j] + " | Card for Straight: " + p2Choice[j].suit + "" + p2Choice[j].num);
				}
				print ("Score for STRAIGHT: " + localScore);
			}
		}
	}
	return localScore;
}

//Checks p2 deck to see if it has a FLUSH.  SCORE for FLUSH = 40.
function MakeFlush () {
	print ("P2: FLUSH?");
	var localScore: int = 0; //Create localScore to return to P2FindHand
	var checkArray = new ArrayList();
	var p2Del = new ArrayList();
	for (var i=0; i<4 && localScore==0; i++) {
		var suitCheck = new Card (i, 0); //suitCheck holds the suit the functions checks in p2 and adds index to checkArray if card has same suit.
		print ("FLUSH - suitCheck: " + suitCheck.suit + "" + suitCheck.num + " | p2.Count: " + p2.Count);
		for (var j=p2.Count-1;j>=0;j--) {
			if (p2[j].suit == suitCheck.suit)
				checkArray.Add(j);
		}
		print("FLUSH - checkArray.Count: " + checkArray.Count);
		if (checkArray.Count >= 3) {
			for (var k=0; k<3; k++) {
				var rdmCard : int = Mathf.RoundToInt (Random.Range (0, checkArray.Count)); //Randomly chooses card to start checking down the deck for a pair.
				if (rdmCard >= checkArray.Count) //Makes sure rdmCard only goes to last index in generic list.
					rdmCard--;
				print ("FLUSH - rdmCard: " + rdmCard + " | Index: " + checkArray[rdmCard]);
				var subSuit : SuitIcon = p2[checkArray[rdmCard]].suit; //Create duplicate of suit property of p1Show's index at i.
				var subNum : int = p2[checkArray[rdmCard]].num;  //Create duplicate of num property of p1Show's index at i.
				var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
				p2Choice.Add(card); //Adds new card to p2Choice.
				print ("FLUSH - p2Choice: " + p2Choice[k].suit + "" + p2Choice[k].num);
				p2Del.Add(checkArray[rdmCard]);
				checkArray.RemoveAt(rdmCard);
			}
			p2Choice = InsertSort (p2Choice);
			localScore = 40 + p2Choice[2].num;
			p2Del = InsertSort(p2Del);
			print ("FLUSH - p2Del.Count: " + p2Del.Count);
			for (var l=2;l>=0;l--) {
				print("p2 card removing: " + p2[p2Del[l]].suit + "" + p2[p2Del[l]].num);
				p2.RemoveAt(p2Del[l]);
			}
			p2Del.Clear();
		}
		checkArray.Clear();
	}
	print ("Score for FLUSH: " + localScore);
	return localScore;
}

//Checks p2 deck to see if it has a THREE OF A KIND.
function MakeThreeKind () {
	print ("P2: THREE OF A KIND??");
	var localScore: int = 0; //Create localScore to return to P2FindHand
	var highNum : int;
	var checkArray = new ArrayList();
	for (var i=0; i<2 && localScore==0; i++) {
		var rdmCard : int = Mathf.RoundToInt (Random.Range (0, p2.Count)); //Randomly chooses card to start checking down the deck for a pair.
		if (rdmCard >= p2.Count)
			rdmCard--;
		else if (rdmCard < 2)
			rdmCard = 2;
		print ("Random number: " + rdmCard + " | P2 deck size: " + p2.Count);
		highNum = p2[rdmCard].num;
		for (var j=rdmCard; j>0 && localScore==0; j--) {
			var checkNum : int = p2[j].num;
			if (highNum == checkNum) {
				checkArray.Add(j);
				if (checkArray.Count > 2) {
					localScore = 50 + highNum;
					for (var k=0; k<3; k++) {
						var addCard : int = checkArray[k];
						var subSuit : SuitIcon = p2[addCard].suit; //Create duplicate of suit property of p1Show's index at i.
						var subNum : int = p2[addCard].num;  //Create duplicate of num property of p1Show's index at i.
						var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
        				p2Choice.Add(card); //Adds new card to p2Choice.
        				p2.RemoveAt(addCard);
        				print("Index for 3Kind: " + checkArray[k] + " | Card for 3Kind: " + p2Choice[k].suit + "" + p2Choice[k].num);
        			}
        			localScore = 50 + highNum;
					print ("Score for THREE OF A KIND: " + localScore);
				}
			}
			else {
				checkArray.Clear();
				highNum = checkNum;
			}
		}
		checkArray.Clear();
	}
	return localScore;
}

//!!!Code for function MakeStraightFlush.!!!
//	for (var i=0; i<4 && localScore==0; i++) {
//		var suitCheck = new Card (i, 0); //suitCheck holds the suit the functions checks in p2 and adds index to checkArray if card has same suit.
//		print ("FLUSH - suitCheck: " + suitCheck.suit + " | p2.Count: " + p2.Count);
//		var startCheck : int = p2.Count - 1;
//		for (var j=0; j<p2.Count; j++) {
//			if (p2[j].suit == suitCheck.suit) {
//				print ("p2 index checking: " + j);
//				checkArray.Add(j);
//			}
//		}
//		print ("checkArray.Count: " + checkArray.Count);
//		for (j=0; j<checkArray.Count;j++) {
//			var currentCard : int = checkArray[j];
//			print ("checkArray " + j + " item: " + checkArray[j]);
//		}
//		print("STRAIGHTFLUSH - checkArray.Count: " + checkArray.Count);
//		if (checkArray.Count >= 3) {
//			for (var k=checkArray.Count-1; k>=2 && localScore==0; k--) {
//				var highNum : int = p2[checkArray[k]].num; //Card to check down the deck for a straight flush.
//				var midNum : int = p2[checkArray[k-1]].num; //Card to check down the deck for a straight flush.
//				var lowNum : int = p2[checkArray[k-2]].num; //Card to check down the deck for a straight flush.
//				print ("STRAIGHTFLUSH???: " + p2[checkArray[k]].suit + "" + p2[checkArray[k]].num + " / " + p2[checkArray[k-1]].suit + "" + p2[checkArray[k-1]].num + " / " + p2[checkArray[k-2]].suit + "" + p2[checkArray[k-2]].num);
//				if (highNum == midNum + 1 && midNum == lowNum + 1) {
//					for (var g=0;g<3;g++) {
//						var subSuit : SuitIcon = p2[checkArray[k - g]].suit; //Create duplicate of suit property of p1Show's index at i.
//						var subNum : int = p2[checkArray[k - g]].num;  //Create duplicate of num property of p1Show's index at i.
//						var card = new Card (subSuit, subNum); //Creates new Card class variable card for p2Choice.
//						p2Choice.Add(card); //Adds new card to p2Choice.
//						print ("STRAIGHTFLUSH - p2Choice: " + p2Choice[k].suit + "" + p2Choice[k].num);
//						p2.RemoveAt(checkArray[k - g]);
//					}
//					p2Choice = InsertSort (p2Choice);
//					localScore = 40 + p2Choice[2].num;
//				}
//			}
//		}
//		checkArray.Clear();
//	}

//Checks p2 deck to see if it has a STRAIGHT FLUSH. SCORE = 70
function MakeStraightFlush () {
	print ("P2: STRAIGHTFLUSH?");
	var localScore: int = 0; //Create localScore to return to P2FindHand
	var checkArray = new ArrayList();
	print ("Score for STRAIGHTFLUSH: " + localScore);
	return localScore;
}

//Checks p2 deck to see if it has a ROYAL FLUSH. SCORE = 100
function MakeRoyalFlush () {
	return 0;
}


//***************************** MAIN FUCTIONS *****************************
//***************************** MAIN FUCTIONS *****************************

function Start () {
	var choiceActive : boolean = false;
	p1ValidChoice = [true, true, true, true, true];
	print ("choiceActive: " + choiceActive);
	var p1Life  = 100; //Set p1 life to 100.
	var p2Life = 100; //Set p2 life to 100.
	Shuffle ();
}

//(Re)Shuffle cards to players
function Shuffle () {
//Clearing all lists for reshuffling.
	p1.Clear();
	p2.Clear();
	p1Show.Clear();
	p2Show.Clear();
	p1Choice.Clear();
    p2Choice.Clear();
    p2AddCard.Clear();
//2 for loops to set variables for cards.  Number NESTING the suit.
	ShowReload (true, 2.0);
    for (var i=1; i<11; i++) {
    	for (var j=0; j<4; j++) {
            var card = new Card (j, i);
            PassCard (card);
       }
    }
    var count : int = 0;
    print("Player 1 has the following cards");
    for (var c in p1) {
        print ("Card " + count + ": " + c.suit+""+c.num);
        count++;
        
    } 	
    count = 0;
    print("Player 2 has the following cards");
    for (var c in p2) {
        print ("Card " + count + ": " + c.suit+""+c.num);
        count++;
    }
    ShowReload (false, 0.0);
    P2FindHand ();
}

//Detemine which choice is not valid for P1InputWindow and OnGUI.
function ValidateChoice (c : int) {
	if (c == 10) {
		for (var i=0; i<5; i++) {
			if (!p1ValidChoice[i])
				p1ValidChoice[i] = true;
		}
	}
	else if (c == 0)
		p1ValidChoice[0] = false;
	else if (c == 1)
		p1ValidChoice[1] = false;
	else if (c == 2)
		p1ValidChoice[2] = false;
	else if (c == 3)
		p1ValidChoice[3] = false;
	else if (c == 4)
		p1ValidChoice[4] = false;
}

//Decides the winner based on scores.	
function RoundEnd () {
	print("P1 Score: " + p1Score + " | P2 Score: " + p2Score);
	if (p1Score > p2Score) {
		var p1Dmg : float = (p1Score - p2Score) * p1AttPwr;
		p2Life -= p1Dmg;
		print ("Hit p2Life: " + p2Life);
		if (p2Life <= 0) {
			var destroy : boolean = true;
			guiSwitch = false;
			laserCreate.LaserShot (1, destroy);
		}
		else {
			destroy = false;
			laserCreate.LaserShot (1, destroy);
			ValidateChoice (10);
			P2FindHand ();
		}
	}
	else if (p2Score > p1Score) {
		var p2Dmg : float = (p2Score - p1Score) * p2AttPwr;
		p1Life -= p2Dmg;
		print ("Hit p1Life: " + p1Life);
		if (p1Life <= 0) {
			destroy = true;
			guiSwitch = false;
			laserCreate.LaserShot (2, destroy);
		}
		else {
			destroy = false;
			laserCreate.LaserShot (2, destroy);
			ValidateChoice (10);
			P2FindHand ();
		}
	}
	else
		P2FindHand();
}

function Update () {
	P1InputWindow (choiceActive);
	if (choiceActive) {
		if (timer > 0)
			timer -= Time.deltaTime;
		else if (timer <= 0) {
			Debug.Log ("Ending Loop");
			choiceActive = false;
			P1CheckHand ();
	
//			Application.LoadLevel ("scene1");
//Destroy(explode);
		}
	}
	if (Input.GetKey ("f")) 
			Application.LoadLevel ("scene1");
}

//************************** GUI FUNCTIONS **************************
//************************** GUI FUNCTIONS **************************

function Awake () {
	scrWidth = Screen.width;//Stores width of game screen.
	scrHeight = Screen.height;//Stores height of game screen.
	print("Screen resolution: " + scrWidth + " x " + scrHeight);
	cWidth = scrWidth * 0.06; //Sets width of each card.
	cHeight = cWidth * 1.455; //Sets height of each card.
	eWidth = scrHeight * 0.03; //Sets width of the ends of the group of cards.
	validChoiceHeight = (2 * eWidth) / 3;
	sWidth = scrWidth * 0.01; //Sets width of the spaces of the group of cards.
	print ("Resized to screen resolution: Card width:" + cWidth + " | height: " + cHeight + " | space: " + sWidth + " | ends: " + eWidth);
	bWidth = (2 + eWidth) + (5 * cWidth) + (6 * sWidth);
	bPosX = (scrWidth - bWidth) / 2;
	lifeHeight = scrHeight * 0.05; //Height of life bar
	bHeight = (2 * eWidth) + cHeight;
	print ("Box height: " + bHeight + " | Box width: " + bWidth + " | Box X: " + bPosX);
	timerWidth = scrWidth * 0.1;
	timerHeight = scrHeight * 0.1; 
	reshuffleDisp = false;
	guiSwitch = true;
}

function ShowCard (p : int, displayCard : List.<Card>) {
	if (p == 1) {
		print ("Setting p1 cards. displayCard.Count: " + displayCard.Count);
		p1Num.Clear();
		p1Suit.Clear();
		for (var i=0; i<displayCard.Count; i++) {
			p1Num.Add(displayCard[i].num);
			if (displayCard[i].suit == SuitIcon.D)
				p1Suit.Add(cardD);
			else if (displayCard[i].suit == SuitIcon.C)
				p1Suit.Add(cardC);
			else if (displayCard[i].suit == SuitIcon.H)
				p1Suit.Add(cardH);
			else if (displayCard[i].suit == SuitIcon.S)
				p1Suit.Add(cardS);
			print ("GUI index: " + i + " | p1 card: " + displayCard[i].suit + "" + p1Num[i]);
		}
	}
	else if (p == 2) {
		print ("Setting p2 cards. displayCard.Count: " + displayCard.Count);
		p2Num.Clear();
		p2Suit.Clear();
		if (displayCard.Count == 5) {
			for (i=0; i<5; i++) {//Randomizes p2Show order, so p1 doesn't figure out the hand.
				var rdmCard : int = Mathf.RoundToInt (Random.Range (0, displayCard.Count));
				if (rdmCard == displayCard.Count)
					rdmCard--;
//				p2Num.Add(displayCard[rdmCard].num);
//				p2Suit.Add(displayCard[rdmCard].suit);
				p2Num.Add(displayCard[rdmCard].num);
				if (displayCard[rdmCard].suit == SuitIcon.D)
					p2Suit.Add(cardD);
				else if (displayCard[rdmCard].suit == SuitIcon.C)
					p2Suit.Add(cardC);
				else if (displayCard[rdmCard].suit == SuitIcon.H)
					p2Suit.Add(cardH);
				else if (displayCard[rdmCard].suit == SuitIcon.S)
					p2Suit.Add(cardS);
				print ("GUI index: " + i + " | rdmCard: " + rdmCard + " | p2 card: " + p2Suit[i] + "" + p2Num[i]);
				displayCard.RemoveAt(rdmCard);
			}
		}
		else
			print ("Error! p2's displayCards (GUI) only have " + displayCard + " cards");
	}
}

function ShowReload (reload : boolean, waitingForReload : float) {
	if (reload) {
		reshuffleDisp = reload;
	}
	else if (!reload) {
		reshuffleDisp = reload;
		yield WaitForSeconds (waitingForReload);
	}
}

function OnGUI () {
	if (guiSwitch) {
		GUI.skin = guiBattle; //Sets skin for battle.
		if (reshuffleDisp) {
			GUI.BeginGroup (Rect ((scrWidth / 2) - ((scrWidth / 2 ) / 2), (scrHeight / 2) - (timerHeight / 2), 	(scrWidth / 2), timerHeight));
			GUI.Label (Rect (0, 0, (scrWidth / 2), timerHeight), "RELOADING...");
	 		GUI.EndGroup ();
	 	}
//Displaying the timer.
		var timerDisp : float = (Mathf.Floor (timer * 100) / 100);
		if (timerDisp < 0)
			timerDisp = 0.00;
		GUI.BeginGroup (Rect ((scrWidth / 2) - (timerWidth / 2), (scrHeight / 2) - (timerHeight / 2), timerWidth, timerHeight));
		GUI.DrawTexture (Rect (0, 0, timerWidth, timerHeight), box, ScaleMode.StretchToFill);//Draws border
		if (choiceActive) {
			GUI.BeginGroup (Rect (.01 * scrWidth, 0, timerWidth, timerHeight));
			GUI.Label (Rect (0, 0, timerWidth, timerHeight), "" + timerDisp, timerStyle);
	 		GUI.EndGroup ();
	 	}
	 	GUI.EndGroup ();
//Displaying P1 cards in hand.
		GUI.BeginGroup (Rect (bPosX, (scrHeight * 0.6), bWidth, bHeight)); //Sets p1 box.
		GUI.DrawTexture (Rect (0, 0, bWidth, bHeight), box, ScaleMode.StretchToFill);//Draws border
		if (choiceActive) {
			for (var i=0; i<p1Num.Count; i++) { //Display p1 hand.
				var cPosX : float = eWidth + (i * (cWidth+sWidth));
				if (p1ValidChoice[i]) { //If p1 HASN'T picked this card yet.
					GUI.BeginGroup (Rect (cPosX, eWidth, cWidth, cHeight));
					GUI.DrawTexture (Rect (0, 0, cWidth, cHeight), p1Suit[i], ScaleMode.StretchToFill);
					GUI.BeginGroup (Rect (0, 0, cWidth, cHeight));
					GUI.Label (Rect (0, 0, cWidth, cHeight), "" + p1Num[i]);
				}
				else if (!p1ValidChoice[i]) { //If p1 HAS picked this card yet.
					GUI.BeginGroup (Rect (cPosX, eWidth - validChoiceHeight, cWidth, cHeight + (2 * validChoiceHeight))); //Layouts anotations of player choice for GUI
					GUI.DrawTexture (Rect (0, 0, cWidth, cHeight + (2 *validChoiceHeight)), validChoiceBG);
					GUI.BeginGroup (Rect (0, validChoiceHeight, cWidth, cHeight));
					GUI.DrawTexture (Rect (0, 0, cWidth, cHeight), p1Suit[i], ScaleMode.StretchToFill);
					GUI.BeginGroup (Rect (0, 0, cWidth, cHeight));
					GUI.Label (Rect (0, 0, cWidth, cHeight), "" + p1Num[i]);
					GUI.EndGroup();
				}
				
				GUI.EndGroup();
				GUI.EndGroup();
			}
		}
		GUI.EndGroup();
//Displaying P2 cards in hand.
		GUI.BeginGroup (Rect (bPosX, (scrHeight * 0.17), bWidth, bHeight)); //Sets p2 box.
		GUI.DrawTexture (Rect (0, 0, bWidth, bHeight), box, ScaleMode.StretchToFill);//Draws border
		if (choiceActive) {
			for (i=0; i<p2Num.Count; i++) { //Display p1 hand.
				cPosX = eWidth + (i * (cWidth+sWidth));
				GUI.BeginGroup (Rect (cPosX, eWidth, cWidth, cHeight));
				GUI.DrawTexture (Rect (0, 0, cWidth, cHeight), p2Suit[i], ScaleMode.StretchToFill);
				GUI.BeginGroup (Rect (0, 0, cWidth, cHeight));
				GUI.Label (Rect (0, 0, cWidth, cHeight), "" + p2Num[i]);
				GUI.EndGroup();
				GUI.EndGroup();
			}
		}
		GUI.EndGroup();
//P1 Lifebar
		var lifeBarStartY : float = scrHeight * (1 - (p1Life / 100));
		GUI.BeginGroup (Rect (scrWidth * .02, (scrHeight / 2) - ((scrHeight / 2) / 2), scrWidth  * 0.05, scrHeight / 2)); //Sets p1 lifebar box, including x position.
		GUI.Box (Rect (0, 0, scrWidth  * 0.05, scrHeight / 2), lifeBg);
		GUI.BeginGroup (Rect (0, 0, scrWidth  * 0.05, (scrHeight / 2) * (p1Life / 100))); //Sets p1 lifebar.
		GUI.Box (Rect (0, 0, scrWidth  * 0.05, scrHeight / 2), lifeBar);
		GUI.EndGroup();
		GUI.EndGroup();
//P2 Lifebar
		lifeBarStartY = scrHeight * (1 - (p2Life / 100));
		GUI.BeginGroup (Rect (scrWidth * .92, (scrHeight / 2) - ((scrHeight / 2) / 2), scrWidth  * 0.05, scrHeight / 2)); //Sets p2 lifebar box, including x position.
		GUI.Box (Rect (0, 0, scrWidth  * 0.05, scrHeight / 2), lifeBg);
		GUI.BeginGroup (Rect (0, 0, scrWidth  * 0.05, (scrHeight / 2) * (p2Life / 100))); //Sets p2 lifebar.
		GUI.Box (Rect (0, 0, scrWidth  * 0.05, scrHeight / 2), lifeBar);
		GUI.EndGroup();
		GUI.EndGroup();
	}
}