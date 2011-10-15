var repository = function() {
	var sketchpads = {};

	return {
		"get_or_create": function(id) {
			if (!sketchpads[id]) {
				sketchpads[id] = {
					artists: {}
				};
			}

			return {
				id: id,
				get_artists: function() {
					return sketchpads[id].artists;
				},
				get_artist: function(artist_id) {
					return sketchpads[id].artists[artist_id];
				},
				add_artist: function(artist_id) {
					requirejs(['artist'], function(Artist) {
						sketchpads[id].artists[artist_id] = new Artist(sketchpads[id].graphics);
					});
				},
				remove_artist: function(artist_id) {
					delete sketchpads[id].artists[artist_id];
				}
			};
		}
	};
}

exports.repository = repository;
