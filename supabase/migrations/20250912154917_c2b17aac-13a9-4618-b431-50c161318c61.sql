-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for projects
CREATE POLICY "Users can view projects they own or collaborate on" ON public.projects
    FOR SELECT USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.project_collaborators
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON public.projects
    FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies for project_collaborators
CREATE POLICY "Users can view collaborators of their projects" ON public.project_collaborators
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND owner_id = auth.uid()
        ) OR user_id = auth.uid()
    );

CREATE POLICY "Project owners can manage collaborators" ON public.project_collaborators
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can update collaborators" ON public.project_collaborators
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can delete collaborators" ON public.project_collaborators
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

-- RLS Policies for project_datasets
CREATE POLICY "Users can view datasets of their projects" ON public.project_datasets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Project owners and editors can manage datasets" ON public.project_datasets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

CREATE POLICY "Project owners and editors can update datasets" ON public.project_datasets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

CREATE POLICY "Project owners and editors can delete datasets" ON public.project_datasets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

-- RLS Policies for analysis_results
CREATE POLICY "Users can view analysis results of their projects" ON public.analysis_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Project owners and editors can create analysis results" ON public.analysis_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

-- RLS Policies for project_comments
CREATE POLICY "Users can view comments of their projects" ON public.project_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Project collaborators can add comments" ON public.project_comments
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can update their own comments" ON public.project_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.project_comments
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for reports
CREATE POLICY "Users can view reports of their projects" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Project owners and editors can create reports" ON public.reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own subscription" ON public.user_subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for usage_analytics
CREATE POLICY "Users can view their own analytics" ON public.usage_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create analytics" ON public.usage_analytics
    FOR INSERT WITH CHECK (true); -- Allow system to track usage

CREATE POLICY "Admins can view all analytics" ON public.usage_analytics
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_project_comments_updated_at
    BEFORE UPDATE ON public.project_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically assign viewer role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default viewer role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
    
    -- Insert default free subscription
    INSERT INTO public.user_subscriptions (user_id, plan)
    VALUES (NEW.id, 'free');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();