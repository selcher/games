window.onload = function() {

    var game = new Phaser.Game( 800, 630, Phaser.CANVAS, "gameContainer", {
        "preload": preload,
        "create": create,
        "update": update,
        "render": render
    } );

    var tiles = [];
    var previousTile = null;
    var selectedTile = null;
    var tileSize = {
        "width": 150,
        "height": 150
    };

    var updating = false;

    var pairsLeft = 8;
    var pairsLeftText = null;

    function preload() {

        game.load.spritesheet( "tiles", "assets/tiles.png", 150, 150, 8 );
        game.load.spritesheet( "button", "assets/button.png", 100, 30, 4 );

    }

    function create() {

        game.stage.backgroundColor = "#2D2D2D";

        generateTiles();

        pairsLeftText = game.add.text(
            650, 16, "Pairs Left: 8",
            {
                "fontSize": "20px",
                "fill": "#000"
            }
        );

        this.btnRestart = new LabelButton(
            game, 700, 80, "button",
            "Restart", restart,
            1, 0, 2, 3 // button frames 1=over, 0=out, 2=down, 3=up
        );

    }

    function update() {

        if ( previousTile && selectedTile ) {
            
            if ( previousTile.frame !== selectedTile.frame ) {

                updating = true;

                setTimeout( function() {

                    if ( updating ) {

                        updating = false;

                        previousTile.tint = 0x000000;
                        previousTile.alpha = 0.5;
                        previousTile.selected = false;
                        previousTile = null;

                        selectedTile.tint = 0x000000;
                        selectedTile.alpha = 0.5;
                        selectedTile.selected = false;
                        selectedTile = null;
                    
                    }

                }, 500 );

            } else {

                previousTile = null;
                selectedTile = null;

                updatePairsLeftText( --pairsLeft );

            }

        }

    }

    function render() {

        game.debug.text( "CurrentTile: " , 0, 0 );

    }


    function generateRandomList( range ) {

        var resultList = [];
        var i = null;
        
        for ( i = range; i--; ) {
            
            resultList.push( i, i );
        
        }
        
        return resultList;

    }

    function generateTiles() {

        var tileOrder = game.math.shuffleArray( generateRandomList( 8 ) );
        var tile = null;
        var row = 1;
        var col = 1;

        tileOrder.forEach( function( order, i ) {

            row = Math.floor( i / 4 );
            col = ( i % 4 );

            tile = game.add.sprite(
                ( tileSize.width * row ) + 5 + ( 5 * row ),
                ( tileSize.height * col ) + 5 + ( 5 * col ),
                "tiles"
            );

            tile.frame = order;
            tile.tint = 0x000000;
            tile.alpha = 0.5;
            tile.selected = false;

            // enable clicking on tile
            tile.inputEnabled = true;
            tile.input.useHandCursor = true;

            tile.events.onInputDown.add( onSelectTile, this );
            tile.events.onInputOver.add( onTileOver, this );
            tile.events.onInputOut.add( onTileOut, this );

            tiles.push( tile );

        } );

    }

    function removeTiles() {

        tiles.forEach( function( tile ) {

            tile.kill();

        } );
        
        tiles = [];

    }

    function onSelectTile( tile, pointer ) {

        if ( !tile.selected && !updating ) {

            if ( previousTile === null || selectedTile === null ) {
                
                tile.selected = true;
                tile.tint = 0xFFFFFF;
                tile.alpha = 1;
            
            }

            if ( previousTile && selectedTile === null ) {

                selectedTile = tile;

            } else if ( previousTile === null ) {

                previousTile = tile;

            }

        }

    }

    function onTileOver( tile, pointer ) {

        if ( !tile.selected ) {

            tile.alpha = 0.8;

        }

    }

    function onTileOut( tile, pointer ) {

        if ( !tile.selected ) {

            tile.alpha = 0.5;

        }

    }

    function updatePairsLeftText( num ) {

        pairsLeftText.text = "Pairs Left: " + num;

    }


    function LabelButton( gameObj, x, y, key, label, callback,
        callbackContext, overFrame, outFrame, downFrame, upFrame ) {

        Phaser.Button.call( this, gameObj, x, y, key, callback,
            callbackContext, overFrame, outFrame, downFrame, upFrame );

        this.style = {
            "font": "15px Arial",
            "fill": "white"
        };

        this.anchor.setTo( 0.5, 0.5 );
        this.label = new Phaser.Text( game, 0, 0, "Label", this.style );
        
        // put the label in the center of the button
        this.label.anchor.setTo( 0.5, 0.5 );

        this.addChild( this.label );
        this.setLabel( label );

        // add button to game
        gameObj.add.existing( this );

    }

    LabelButton.prototype = Object.create( Phaser.Button.prototype );
    LabelButton.prototype.constructor = LabelButton;

    LabelButton.prototype.setLabel = function( label ) {

        this.label.setText( label );

    };

    function restart() {

        removeTiles();

        // reset pairs left text
        updatePairsLeftText( pairsLeft = 8 );

        generateTiles();

    }

};