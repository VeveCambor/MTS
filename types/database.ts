export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nick: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: number;
          trainer_id: string | null;
          is_user_trainer: boolean;
          date_of_birth: string | null;
          avatar: number | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nick: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: number;
          trainer_id?: string | null;
          is_user_trainer?: boolean;
          date_of_birth?: string | null;
          avatar?: number | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      activities: {
        Row: { id: string; name: string; description: string | null; icon: string | null };
        Insert: { id?: string; name: string; description?: string | null; icon?: string | null };
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>;
        Relationships: [];
      };
      activity_groups: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          name: string;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["activity_groups"]["Insert"]>;
        Relationships: [];
      };
      activity_trainings: {
        Row: {
          id: string;
          activity_group_id: string;
          user_id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          activity_group_id: string;
          user_id: string;
          name: string;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["activity_trainings"]["Insert"]>;
        Relationships: [];
      };
      activity_training_param_units: {
        Row: { id: string; name: string; description: string | null };
        Insert: { id?: string; name: string; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["activity_training_param_units"]["Insert"]>;
        Relationships: [];
      };
      parameter_types: {
        Row: { id: string; name: string; description: string | null };
        Insert: { id?: string; name: string; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["parameter_types"]["Insert"]>;
        Relationships: [];
      };
      trainer_parameters: {
        Row: {
          id: string;
          user_id: string;
          activity_id: string;
          parameter_type_id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_id: string;
          parameter_type_id: string;
          name: string;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["trainer_parameters"]["Insert"]>;
        Relationships: [];
      };
      activity_training_parameters_assign: {
        Row: {
          id: string;
          activity_training_id: string;
          trainer_parameter_id: string;
          length_unit_id: string | null;
          value: number | null;
          value_text: string | null;
        };
        Insert: {
          id?: string;
          activity_training_id: string;
          trainer_parameter_id: string;
          length_unit_id?: string | null;
          value?: number | null;
          value_text?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["activity_training_parameters_assign"]["Insert"]>;
        Relationships: [];
      };
      actual_user_parameters: {
        Row: {
          id: string;
          user_id: string;
          trainer_id: string;
          trainer_parameter_id: string;
          value: string | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trainer_id: string;
          trainer_parameter_id: string;
          value?: string | null;
          recorded_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["actual_user_parameters"]["Insert"]>;
        Relationships: [];
      };
      history_user_parameters: {
        Row: {
          trainer_parameter_id: string;
          user_id: string;
          trainer_id: string;
          date_time_from: string;
          date_time_to: string;
          value: string | null;
        };
        Insert: {
          trainer_parameter_id: string;
          user_id: string;
          trainer_id: string;
          date_time_from: string;
          date_time_to: string;
          value?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["history_user_parameters"]["Insert"]>;
        Relationships: [];
      };
      trainer_activity_enable: {
        Row: { user_id: string; activity_id: string };
        Insert: { user_id: string; activity_id: string };
        Update: Partial<Database["public"]["Tables"]["trainer_activity_enable"]["Insert"]>;
        Relationships: [];
      };
      training_plans: {
        Row: {
          id: string;
          trainer_id: string;
          name: string;
          description: string | null;
          cycle_length: number;
          number_of_cycles: number;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          name: string;
          description?: string | null;
          cycle_length: number;
          number_of_cycles: number;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["training_plans"]["Insert"]>;
        Relationships: [];
      };
      training_plan_week_definitions: {
        Row: {
          id: string;
          training_plan_id: string;
          autonum_cycle: number;
          expected_km: number | null;
          expected_time: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          training_plan_id: string;
          autonum_cycle: number;
          expected_km?: number | null;
          expected_time?: string | null;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["training_plan_week_definitions"]["Insert"]>;
        Relationships: [];
      };
      training_plan_activity_training_assigns: {
        Row: {
          id: string;
          training_plan_id: string;
          activity_training_id: string | null;
          autonum_cycle: number;
          autonum_in_cycle: number;
          order_in_cycle: number | null;
          name: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          training_plan_id: string;
          activity_training_id?: string | null;
          autonum_cycle: number;
          autonum_in_cycle: number;
          order_in_cycle?: number | null;
          name?: string | null;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["training_plan_activity_training_assigns"]["Insert"]>;
        Relationships: [];
      };
      training_plan_user_assigns: {
        Row: {
          id: string;
          user_id: string;
          trainer_id: string;
          name: string;
          description: string | null;
          cycle_length: number;
          number_of_cycles: number;
          enabled: boolean;
          date_time_start: string;
          source_template_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trainer_id: string;
          name: string;
          description?: string | null;
          cycle_length: number;
          number_of_cycles: number;
          enabled?: boolean;
          date_time_start: string;
          source_template_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["training_plan_user_assigns"]["Insert"]>;
        Relationships: [];
      };
      training_plan_user_assign_week_definitions: {
        Row: {
          id: string;
          assign_id: string;
          autonum_cycle: number;
          expected_km: number | null;
          expected_time: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          assign_id: string;
          autonum_cycle: number;
          expected_km?: number | null;
          expected_time?: string | null;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["training_plan_user_assign_week_definitions"]["Insert"]>;
        Relationships: [];
      };
      training_plan_user_assign_activity_training_assigns: {
        Row: {
          id: string;
          assign_id: string;
          activity_training_id: string | null;
          autonum_cycle: number;
          autonum_in_cycle: number;
          order_in_cycle: number | null;
          name: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          assign_id: string;
          activity_training_id?: string | null;
          autonum_cycle: number;
          autonum_in_cycle: number;
          order_in_cycle?: number | null;
          name?: string | null;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["training_plan_user_assign_activity_training_assigns"]["Insert"]>;
        Relationships: [];
      };
      training_diary_notes: {
        Row: {
          id: string;
          assign_activity_id: string;
          user_id: string;
          note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assign_activity_id: string;
          user_id: string;
          note: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["training_diary_notes"]["Insert"]>;
        Relationships: [];
      };
      trainer_invites: {
        Row: {
          id: string;
          trainer_id: string;
          email: string;
          code: string;
          status: string;
          accepted_by: string | null;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          email: string;
          code: string;
          status?: string;
          accepted_by?: string | null;
          created_at?: string;
          expires_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trainer_invites"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_plan_from_template: {
        Args: { p_template_id: string; p_user_id: string; p_start_date: string };
        Returns: string;
      };
      get_plan_complete: {
        Args: { p_assign_id: string };
        Returns: Json;
      };
      get_trainer_invite_preview: {
        Args: { p_code: string };
        Returns: {
          trainer_nick: string;
          trainer_first_name: string | null;
          trainer_last_name: string | null;
          valid: boolean;
        }[];
      };
      list_trainer_invites: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          code: string;
          email: string;
          status: string;
          expires_at: string;
          created_at: string;
          trainer_id: string;
          trainer_nick: string;
          trainer_first_name: string | null;
          trainer_last_name: string | null;
        }[];
      };
      create_trainer_invite: {
        Args: { p_email: string };
        Returns: Database["public"]["Tables"]["trainer_invites"]["Row"];
      };
      accept_trainer_invite: {
        Args: { p_code: string };
        Returns: string;
      };
      cancel_trainer_invite: {
        Args: { p_invite_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
