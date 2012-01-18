
# This file is the implementation of the  RemoteMoveAction.
# The implementation must comply with the action definition pattern
# that is briefly described in the Madmass::Action::Action class.

module Actions
  class RemoteMoveAction < Madmass::Action::RemoteAction
    action_params :latitude, :longitude
    #action_states :none
    #next_state :none

    # [OPTIONAL]  Add your initialization code here.
    # def initialize params
    #   super
    #  # My initialization code
    # end

    # [MANDATORY] Override this method in your action to define
    # the action effects.
    def execute
      send_action(:cmd => 'send', :latitude => @parameters[:latitude], :longitude => @parameters[:longitude])
    end

    # [MANDATORY] Override this method in your action to define
    # the perception content.
    def build_result
     #Example
      p = Madmass::Perception::Percept.new(self)
      p.add_headers({:topics => 'all'}) #who must receive the percept
      p.data =  {
        :agent => Madmass.current_agent.id,
        :position => {
          :latitude => @parameters[:latitude],
          :longitude => @parameters[:longitude]
        }
      }
      Madmass.current_perception << p
    end

    # [OPTIONAL] - The default implementation returns always true
    # Override this method in your action to define when the action is
    # applicable (i.e. to verify the action preconditions).
    # def applicable?
    #
    #   if CONDITION
    #     why_not_applicable.add(:'DESCR_SYMB', 'EXPLANATION')
    #   end
    #
    #   return why_not_applicable.empty?
    # end

    # [OPTIONAL] Override this method to add parameters preprocessing code
    # The parameters can be found in the @parameters hash
    # def process_params
    #   puts "Implement me!"
    # end

  end

end