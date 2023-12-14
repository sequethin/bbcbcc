const Card = {
    fromBattleInfo({
        fighter_banner_info, play, sid, common
                   }) {
        // We always want the sid in the battle info to correspond to the current user card
        this.sid = sid;
        this.name = [fighter_banner_info.personal_info.fighter_id];

        this.platform_name = [fighter_banner_info.personal_info.platform_name];

        this.player_comment = [fighter_banner_info.profile_comment.profile_tag_name];

        this.display_title = [fighter_banner_info.title_data.title_data_val];


        // TODO: big todo, we really need to inspect this JSON before assuming it's all there
        // TODO: this is also in the json as "is_my_data", I think
        this.loggedInUser = (this.sid === common.loginUser.shortId);

        // we only see the data for the users currently selected char for ranked
        // Capcom calls it Favorite Character
        // TODO: track favorite characters across a user sid
        this.current_selected_char_name = [fighter_banner_info.favorite_character_name];

        // TODO Circle tracking (main_circle.leader.short_id)
        this.circle = [{
            circle_id : fighter_banner_info.main_circle.circle_id,
            circle_name: fighter_banner_info.main_circle.circle_name
        }];

        this.home_name = [fighter_banner_info.home_name];

        this.play_metrics = {
            as_of: Date.now(),
            metrics: play
        };

        return this;
    },
    updateMatchReplayData({ sid, }) {

    }

}